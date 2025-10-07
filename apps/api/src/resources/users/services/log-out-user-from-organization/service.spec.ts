// apps/api/src/resources/users/services/log-out-user-from-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LogOutUserFromOrganizationService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { IUser } from '@connect-phone/shared-types';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import {
  createMockOrganization,
  createMockUser,
  createMockUserOrganization,
} from '../../../../test/factories';

describe('LogOutUserFromOrganizationService', () => {
  let service: LogOutUserFromOrganizationService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization = createMockOrganization();
  const mockUser = createMockUser({ loggedOrganization: mockOrganization });

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
        {
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
          },
        },
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
      userRepository.save.mockImplementation(async (user: IUser) => {
        return {
          ...user,
        } as unknown as IUser;
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
        ...mockUser,
        loggedOrganizationId: null,
        loggedOrganization: null,
      });

      currentDbUserService.getCurrentDbUser.mockResolvedValue(loggedOutUser);
      userRepository.save.mockImplementation(async (user: IUser) => {
        return {
          ...user,
        } as unknown as IUser;
      });

      const result = await service.logOutUserFromOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.loggedOrganizationId).toBe(null);
      expect(result.loggedOrganization).toBe(null);
    });
  });
});
