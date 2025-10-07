// apps/api/src/resources/users/services/get-user-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetUserByIdService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  IUserOrganization,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import {
  createMockOrganization,
  createMockUser,
} from '../../../../test/factories';

//-------------------------------------------------------------------------------------------------

describe('GetUserByIdService', () => {
  let service: GetUserByIdService;
  let userOrganizationRepository: jest.Mocked<
    Repository<UserOrganizationEntity>
  >;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();

  const mockUser = createMockUser({
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
  });

  const mockUserOrganization: IUserOrganization = {
    id: 1,
    userId: 1,
    organizationId: 1,
    role: UserOrganizationRole.ADMIN,
    user: mockUser,
    organization: mockOrganization,
  } as IUserOrganization;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CurrentOrganizationService,
          useValue: {
            getCurrentOrganization: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetUserByIdService>(GetUserByIdService);
    userOrganizationRepository = module.get(
      getRepositoryToken(UserOrganizationEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return user with role when user exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );

      const result = await service.getUserById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 1,
          organizationId: 1,
        },
        relations: [
          'user',
          'user.loggedOrganization',
          'user.userOrganizations',
          'user.userOrganizations.organization',
        ],
      });
      expect(result).toEqual({
        ...mockUser,
        role: UserOrganizationRole.ADMIN,
      });
      expect(result.role).toBe(UserOrganizationRole.ADMIN);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(userOrganizationRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not belong to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrow(
        new NotFoundException(
          'User with ID 1 not found in current organization'
        )
      );

      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 1,
          organizationId: 1,
        },
        relations: [
          'user',
          'user.loggedOrganization',
          'user.userOrganizations',
          'user.userOrganizations.organization',
        ],
      });
    });

    it('should throw NotFoundException when user does not exist in user-organization', async () => {
      const userOrgWithoutUser = {
        ...mockUserOrganization,
        user: null,
      } as unknown as UserOrganizationEntity;

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(userOrgWithoutUser);

      await expect(service.getUserById(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );

      expect(userOrganizationRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle different user IDs correctly', async () => {
      const userId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );

      await service.getUserById(userId);

      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: userId,
          organizationId: 1,
        },
        relations: [
          'user',
          'user.loggedOrganization',
          'user.userOrganizations',
          'user.userOrganizations.organization',
        ],
      });
    });

    it('should handle different roles correctly', async () => {
      const operatorUserOrganization = {
        ...mockUserOrganization,
        role: UserOrganizationRole.OPERATOR,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        operatorUserOrganization
      );

      const result = await service.getUserById(1);

      expect(result.role).toBe(UserOrganizationRole.OPERATOR);
      expect(result).toEqual({
        ...mockUser,
        role: UserOrganizationRole.OPERATOR,
      });
    });

    it('should handle database errors during user organization lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getUserById(1)).rejects.toThrow('Database error');

      expect(userOrganizationRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return user with complete relations and role', async () => {
      const userWithRelations = {
        ...mockUser,
        userOrganizations: [mockUserOrganization],
      };

      const userOrganizationWithRelations = {
        ...mockUserOrganization,
        user: userWithRelations,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        userOrganizationWithRelations
      );

      const result = await service.getUserById(1);

      expect(result).toEqual({
        ...userWithRelations,
        role: UserOrganizationRole.ADMIN,
      });
      expect(result.userOrganizations).toHaveLength(1);
      expect(result.role).toBe(UserOrganizationRole.ADMIN);
    });
  });
});
