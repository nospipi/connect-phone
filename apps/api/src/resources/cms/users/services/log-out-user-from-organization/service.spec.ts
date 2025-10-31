// apps/api/src/resources/users/services/log-out-user-from-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LogOutUserFromOrganizationService } from './service';
import { UserEntity } from '@/database/entities/user.entity';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';
import {
  createMockUser,
  createCurrentDbUserServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

describe('LogOutUserFromOrganizationService', () => {
  let service: LogOutUserFromOrganizationService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockUser = createMockUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogOutUserFromOrganizationService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        createCurrentDbUserServiceProvider(),
      ],
    }).compile();

    service = module.get<LogOutUserFromOrganizationService>(
      LogOutUserFromOrganizationService
    );
    userRepository = module.get(getRepositoryToken(UserEntity));
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logOutUserFromOrganization', () => {
    it('should log out user by setting loggedOrganizationId to null', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userRepository.save.mockImplementation(async (user) => {
        return user as UserEntity;
      });

      const result = await service.logOutUserFromOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.loggedOrganizationId).toBe(null);
      expect(result.loggedOrganization).toBe(null);
    });

    it('should throw NotFoundException if no current user', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      await expect(service.logOutUserFromOrganization()).rejects.toThrow(
        NotFoundException
      );
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should work even if user is already logged out', async () => {
      const loggedOutUser = createMockUser({
        loggedOrganizationId: null,
        loggedOrganization: null,
      });

      currentDbUserService.getCurrentDbUser.mockResolvedValue(loggedOutUser);
      userRepository.save.mockImplementation(async (user) => {
        return user as UserEntity;
      });

      const result = await service.logOutUserFromOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.loggedOrganizationId).toBe(null);
      expect(result.loggedOrganization).toBe(null);
    });
  });
});

// apps/api/src/resources/users/services/log-out-user-from-organization/service.spec.ts
