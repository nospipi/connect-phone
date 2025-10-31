// apps/api/src/resources/users/services/delete-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteUserService } from './service';
import { UserEntity } from '@/database/entities/user.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockUser,
  createMockUserOrganization,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

describe('DeleteUserService', () => {
  let service: DeleteUserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let userOrganizationRepository: jest.Mocked<
    Repository<UserOrganizationEntity>
  >;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockUser = createMockUser({ loggedOrganization: mockOrganization });
  const mockUserOrganization = createMockUserOrganization();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
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

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.remove.mockResolvedValue(mockUser);

      const result = await service.deleteUserById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 1, organizationId: 1 },
        relations: [
          'user',
          'user.loggedOrganization',
          'user.userOrganizations',
        ],
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'loggedOrganization',
          'userOrganizations',
          'userOrganizations.organization',
        ],
      });
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteUserById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(userOrganizationRepository.findOne).not.toHaveBeenCalled();
      expect(userRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not belong to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUserById(1)).rejects.toThrow(
        new NotFoundException(
          'User with ID 1 not found in current organization'
        )
      );

      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 1, organizationId: 1 },
        relations: [
          'user',
          'user.loggedOrganization',
          'user.userOrganizations',
        ],
      });
      expect(userRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist in user-organization', async () => {
      const userOrgWithoutUser = createMockUserOrganization({
        user: undefined,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(userOrgWithoutUser);

      await expect(service.deleteUserById(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );

      expect(userRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found in final lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUserById(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );

      expect(userRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle different user IDs correctly', async () => {
      const userId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.remove.mockResolvedValue(mockUser);

      await service.deleteUserById(userId);

      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId, organizationId: 1 },
        relations: [
          'user',
          'user.loggedOrganization',
          'user.userOrganizations',
        ],
      });
    });

    it('should handle database errors during user organization lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteUserById(1)).rejects.toThrow('Database error');

      expect(userRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during user removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteUserById(1)).rejects.toThrow('Database error');

      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should return user with complete relations', async () => {
      const userWithRelations = {
        ...mockUser,
        userOrganizations: [mockUserOrganization],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization
      );
      userRepository.findOne.mockResolvedValue(userWithRelations);
      userRepository.remove.mockResolvedValue(userWithRelations);

      const result = await service.deleteUserById(1);

      expect(result).toEqual(userWithRelations);
      expect(result.userOrganizations).toHaveLength(1);
    });
  });
});

// apps/api/src/resources/users/services/delete-user/service.spec.ts
