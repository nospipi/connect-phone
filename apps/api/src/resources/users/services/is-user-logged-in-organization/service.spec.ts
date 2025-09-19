// apps/api/src/resources/users/services/is-user-logged-in-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IsUserLoggedInOrganizationService } from './service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { UserEntity } from '../../../../database/entities/user.entity';
import {
  IUser,
  IOrganization,
  IUserOrganization,
} from '@connect-phone/shared-types';

//-------------------------------------------------------------------------------------------------

describe('IsUserLoggedInOrganizationService', () => {
  let service: IsUserLoggedInOrganizationService;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockUserWithOrganization: IUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: null,
    userOrganizations: [],
    auditLogs: [],
  } as IUser;

  const mockUserWithoutOrganization: IUser = {
    id: 2,
    email: 'test2@example.com',
    firstName: 'Test2',
    lastName: 'User2',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: null,
    loggedOrganization: null,
    userOrganizations: [],
    auditLogs: [],
  } as IUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsUserLoggedInOrganizationService,
        {
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IsUserLoggedInOrganizationService>(
      IsUserLoggedInOrganizationService
    );
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return true when user has a logged organization ID', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithOrganization
      );

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when user has null loggedOrganizationId', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithoutOrganization
      );

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should return false when user has undefined loggedOrganizationId', async () => {
      // Arrange
      const userWithUndefinedOrgId: IUser = {
        id: 3,
        email: 'test3@example.com',
        firstName: 'Test3',
        lastName: 'User3',
        createdAt: '2024-01-01T00:00:00Z',
        loggedOrganizationId: undefined as any,
        loggedOrganization: null,
        userOrganizations: [],
        auditLogs: [],
      } as IUser;
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        userWithUndefinedOrgId
      );

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should return true when user has any positive organization ID', async () => {
      // Arrange
      const userWithOrgId5 = {
        ...mockUserWithOrganization,
        loggedOrganizationId: 5,
      } as IUser;
      currentDbUserService.getCurrentDbUser.mockResolvedValue(userWithOrgId5);

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when user has zero loggedOrganizationId', async () => {
      // Arrange
      const userWithZeroOrgId = {
        ...mockUserWithOrganization,
        loggedOrganizationId: 0,
      } as IUser;
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        userWithZeroOrgId
      );

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should throw NotFoundException when no current user found', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute()).rejects.toThrow(
        new NotFoundException('No current user found')
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
    });

    it('should handle getCurrentDbUser service errors', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockRejectedValue(
        new Error('Database connection error')
      );

      // Act & Assert
      await expect(service.execute()).rejects.toThrow(
        'Database connection error'
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
    });
  });
});
