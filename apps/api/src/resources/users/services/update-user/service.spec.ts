// apps/api/src/resources/users/services/update-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import { CurrentDbUserService } from '../../../../common/services/current-db-user.service';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import { UpdateUserDto } from './update-user.dto';
import {
  createMockOrganization,
  createMockUser,
  createCurrentDbUserServiceProvider,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let userOrganizationRepository: jest.Mocked<
    Repository<UserOrganizationEntity>
  >;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockUser = createMockUser();
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
        createCurrentDbUserServiceProvider(),
        createCurrentOrganizationServiceProvider(),
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

      const result = await service.updateUserById(updateData);

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

      const result = await service.updateUserById(updateData);

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
      const updateData = { firstName: 'Updated' } as unknown as UpdateUserDto;

      await expect(service.updateUserById(updateData)).rejects.toThrow(
        new NotFoundException('User ID is required')
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateData: UpdateUserDto = { id: 999, firstName: 'Updated' };
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUserById(updateData)).rejects.toThrow(
        new NotFoundException('User not found')
      );
    });

    it('should handle role update when user organization not found', async () => {
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

      const result = await service.updateUserById(updateData);

      expect(userOrganizationRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});

// apps/api/src/resources/users/services/update-user/service.spec.ts
