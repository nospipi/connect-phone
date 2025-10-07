// apps/api/src/resources/users/services/update-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { UpdateUserDto } from './update-user.dto';
import {
  createMockOrganization,
  createMockUser,
} from '../../../../test/factories';

//-------------------------------------------------------------------------------------------------

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let userOrganizationRepository: jest.Mocked<
    Repository<UserOrganizationEntity>
  >;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockUser = createMockUser({
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: null,
  });

  const mockOrganization = createMockOrganization();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
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

    service = module.get<UpdateUserService>(UpdateUserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    userOrganizationRepository = module.get(
      getRepositoryToken(UserOrganizationEntity)
    );
    currentDbUserService = module.get(CurrentDbUserService);
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUserById', () => {
    it('should update user by ID with basic info', async () => {
      // Arrange
      const updateData: UpdateUserDto = {
        id: 1,
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      };
      const updatedUser = {
        ...mockUser,
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser as UserEntity);
      userRepository.save.mockResolvedValue(updatedUser as UserEntity);

      // Act
      const result = await service.updateUserById(updateData);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      });
      expect(result.firstName).toBe('Updated');
    });

    it('should update user role when provided', async () => {
      // Arrange
      const mockUserOrganization = {
        id: 1,
        userId: 1,
        organizationId: 1,
        role: UserOrganizationRole.OPERATOR,
      };

      const updateData: UpdateUserDto = {
        id: 1,
        role: UserOrganizationRole.ADMIN,
      };

      userRepository.findOne.mockResolvedValue(mockUser as UserEntity);
      userRepository.save.mockResolvedValue(mockUser as UserEntity);
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(
        mockUserOrganization as UserOrganizationEntity
      );
      userOrganizationRepository.save.mockResolvedValue({
        ...mockUserOrganization,
        role: UserOrganizationRole.ADMIN,
      } as UserOrganizationEntity);

      // Act
      const result = await service.updateUserById(updateData);

      // Assert
      expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 1,
          organizationId: 1,
        },
      });
      expect(userOrganizationRepository.save).toHaveBeenCalledWith({
        ...mockUserOrganization,
        role: UserOrganizationRole.ADMIN,
      });
    });

    it('should throw NotFoundException when id not provided', async () => {
      // Arrange
      const updateData = { firstName: 'Updated' } as unknown as UpdateUserDto;

      // Act & Assert
      await expect(service.updateUserById(updateData)).rejects.toThrow(
        new NotFoundException('User ID is required')
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const updateData: UpdateUserDto = { id: 999, firstName: 'Updated' };
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateUserById(updateData)).rejects.toThrow(
        new NotFoundException('User not found')
      );
    });

    it('should handle role update when user organization not found', async () => {
      // Arrange
      const updateData: UpdateUserDto = {
        id: 1,
        role: UserOrganizationRole.ADMIN,
      };

      userRepository.findOne.mockResolvedValue(mockUser as UserEntity);
      userRepository.save.mockResolvedValue(mockUser as UserEntity);
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userOrganizationRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.updateUserById(updateData);

      // Assert
      expect(userOrganizationRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
