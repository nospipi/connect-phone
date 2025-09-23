// apps/api/src/resources/users/services/create-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateUserService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { CreateUserDto } from './create-user.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  IUser,
  IOrganization,
  UserOrganizationRole,
  IUserOrganization,
} from '@connect-phone/shared-types';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let userOrganizationRepository: jest.Mocked<
    Repository<UserOrganizationEntity>
  >;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let dataSource: jest.Mocked<DataSource>;

  const mockOrganization: IOrganization = {
    id: 1,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as IOrganization;

  const mockUser: IUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: null,
    loggedOrganization: null,
    userOrganizations: [],
    auditLogs: [],
  } as IUser;

  const mockUserOrganization: IUserOrganization = {
    id: 1,
    userId: 1,
    organizationId: 1,
    role: UserOrganizationRole.OPERATOR,
    user: mockUser,
    organization: mockOrganization,
  } as IUserOrganization;

  const mockUserWithRelations: IUser = {
    ...mockUser,
    userOrganizations: [mockUserOrganization],
  } as IUser;

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockTransactionManager = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  } as unknown as jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CurrentOrganizationService,
          useValue: {
            getCurrentOrganization: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    userOrganizationRepository = module.get(
      getRepositoryToken(UserOrganizationEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewUser', () => {
    it('should create a new user with organization relationship successfully', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );

      // Mock transaction with proper typing
      (dataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (manager: EntityManager) => Promise<any>) => {
          return callback(mockTransactionManager);
        }
      );

      (mockTransactionManager.create as jest.Mock)
        .mockReturnValueOnce(mockUser) // for UserEntity
        .mockReturnValueOnce(mockUserOrganization); // for UserOrganizationEntity

      (mockTransactionManager.save as jest.Mock)
        .mockResolvedValueOnce(mockUser) // save user
        .mockResolvedValueOnce(mockUserOrganization); // save user-organization

      (mockTransactionManager.findOne as jest.Mock).mockResolvedValue(
        mockUserWithRelations
      );

      // Act
      const result = await service.createNewUser(mockCreateUserDto);

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);

      expect(mockTransactionManager.create).toHaveBeenCalledWith(UserEntity, {
        email: mockCreateUserDto.email,
        firstName: mockCreateUserDto.firstName,
        lastName: mockCreateUserDto.lastName,
        loggedOrganizationId: mockOrganization.id,
      });

      expect(mockTransactionManager.create).toHaveBeenCalledWith(
        UserOrganizationEntity,
        {
          userId: mockUser.id,
          organizationId: mockOrganization.id,
          role: UserOrganizationRole.OPERATOR,
        }
      );

      expect(mockTransactionManager.save).toHaveBeenCalledWith(
        UserEntity,
        mockUser
      );
      expect(mockTransactionManager.save).toHaveBeenCalledWith(
        UserOrganizationEntity,
        mockUserOrganization
      );

      expect(mockTransactionManager.findOne).toHaveBeenCalledWith(UserEntity, {
        where: { id: mockUser.id },
        relations: [
          'loggedOrganization',
          'userOrganizations',
          'userOrganizations.organization',
        ],
      });

      expect(result).toEqual(mockUserWithRelations);
    });

    it('should use provided role when specified', async () => {
      // Arrange
      const dtoWithRole: CreateUserDto = {
        ...mockCreateUserDto,
        role: UserOrganizationRole.ADMIN,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (manager: EntityManager) => Promise<any>) => {
          return callback(mockTransactionManager);
        }
      );

      (mockTransactionManager.create as jest.Mock)
        .mockReturnValueOnce(mockUser)
        .mockReturnValueOnce(mockUserOrganization);

      (mockTransactionManager.save as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUserOrganization);

      (mockTransactionManager.findOne as jest.Mock).mockResolvedValue(
        mockUserWithRelations
      );

      // Act
      await service.createNewUser(dtoWithRole);

      // Assert
      expect(mockTransactionManager.create).toHaveBeenCalledWith(
        UserOrganizationEntity,
        {
          userId: mockUser.id,
          organizationId: mockOrganization.id,
          role: UserOrganizationRole.ADMIN,
        }
      );
    });

    it('should default to OPERATOR role when no role provided', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (manager: EntityManager) => Promise<any>) => {
          return callback(mockTransactionManager);
        }
      );

      (mockTransactionManager.create as jest.Mock)
        .mockReturnValueOnce(mockUser)
        .mockReturnValueOnce(mockUserOrganization);

      (mockTransactionManager.save as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUserOrganization);

      (mockTransactionManager.findOne as jest.Mock).mockResolvedValue(
        mockUserWithRelations
      );

      // Act
      await service.createNewUser(mockCreateUserDto);

      // Assert
      expect(mockTransactionManager.create).toHaveBeenCalledWith(
        UserOrganizationEntity,
        {
          userId: mockUser.id,
          organizationId: mockOrganization.id,
          role: UserOrganizationRole.OPERATOR,
        }
      );
    });

    it('should handle transaction rollback on error', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );

      const error = new Error('Database error');
      (dataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (manager: EntityManager) => Promise<any>) => {
          return callback(mockTransactionManager);
        }
      );

      (mockTransactionManager.create as jest.Mock).mockReturnValue(mockUser);
      (mockTransactionManager.save as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(service.createNewUser(mockCreateUserDto)).rejects.toThrow(
        'Database error'
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    });

    it('should work with null organization', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (manager: EntityManager) => Promise<any>) => {
          return callback(mockTransactionManager);
        }
      );

      (mockTransactionManager.create as jest.Mock)
        .mockReturnValueOnce(mockUser)
        .mockReturnValueOnce(mockUserOrganization);

      (mockTransactionManager.save as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUserOrganization);

      (mockTransactionManager.findOne as jest.Mock).mockResolvedValue(
        mockUserWithRelations
      );

      // Act
      await service.createNewUser(mockCreateUserDto);

      // Assert
      expect(mockTransactionManager.create).toHaveBeenCalledWith(UserEntity, {
        email: mockCreateUserDto.email,
        firstName: mockCreateUserDto.firstName,
        lastName: mockCreateUserDto.lastName,
        loggedOrganizationId: undefined,
      });

      expect(mockTransactionManager.create).toHaveBeenCalledWith(
        UserOrganizationEntity,
        {
          userId: mockUser.id,
          organizationId: undefined,
          role: UserOrganizationRole.OPERATOR,
        }
      );
    });
  });
});
