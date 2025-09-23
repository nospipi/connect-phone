// apps/api/src/resources/users/services/create-user-invitation/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInvitationService } from './service';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import {
  IUser,
  IOrganization,
  IUserInvitation,
} from '@connect-phone/shared-types';

describe('CreateUserInvitationService', () => {
  let service: CreateUserInvitationService;
  let userInvitationRepository: jest.Mocked<Repository<UserInvitationEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

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
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
    userOrganizations: [],
    auditLogs: [],
  } as IUser;

  const mockUserInvitation: IUserInvitation = {
    id: 1,
    email: 'newuser@example.com',
    status: 'PENDING',
    createdAt: '2024-01-01T00:00:00Z',
    organizationId: 1,
    organization: mockOrganization,
    invitedById: 1,
    invitedBy: mockUser,
    role: 'OPERATOR',
  } as IUserInvitation;

  const mockCreateUserInvitationDto: CreateUserInvitationDto = {
    email: 'newuser@example.com',
    role: 'OPERATOR' as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserInvitationService,
        {
          provide: getRepositoryToken(UserInvitationEntity),
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
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateUserInvitationService>(
      CreateUserInvitationService
    );
    userInvitationRepository = module.get(
      getRepositoryToken(UserInvitationEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUserInvitation', () => {
    it('should create a user invitation successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockResolvedValue(mockUserInvitation);

      const result = await service.createUserInvitation(
        mockCreateUserInvitationDto
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userInvitationRepository.create).toHaveBeenCalledWith({
        email: mockCreateUserInvitationDto.email,
        role: mockCreateUserInvitationDto.role,
        organizationId: mockOrganization.id,
        invitedById: mockUser.id,
      });
      expect(userInvitationRepository.save).toHaveBeenCalledWith(
        mockUserInvitation
      );
      expect(result).toEqual(mockUserInvitation);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockResolvedValue(mockUserInvitation);

      const result = await service.createUserInvitation(
        mockCreateUserInvitationDto
      );

      expect(userInvitationRepository.create).toHaveBeenCalledWith({
        email: mockCreateUserInvitationDto.email,
        role: mockCreateUserInvitationDto.role,
        organizationId: undefined,
        invitedById: mockUser.id,
      });
      expect(result).toEqual(mockUserInvitation);
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createUserInvitation(mockCreateUserInvitationDto)
      ).rejects.toThrow('Database error');
    });
  });
});
