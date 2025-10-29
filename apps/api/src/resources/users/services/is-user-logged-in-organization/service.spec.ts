// apps/api/src/resources/users/services/is-user-logged-in-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IsUserLoggedInOrganizationService } from './service';
import { CurrentDbUserService } from '../../../../common/services/current-db-user.service';
import {
  createMockUser,
  createCurrentDbUserServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('IsUserLoggedInOrganizationService', () => {
  let service: IsUserLoggedInOrganizationService;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockUserWithOrganization = createMockUser({
    loggedOrganizationId: 1,
  });
  const mockUserWithoutOrganization = createMockUser({
    id: 2,
    email: 'test2@example.com',
    loggedOrganizationId: null,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsUserLoggedInOrganizationService,
        createCurrentDbUserServiceProvider(),
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
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithOrganization
      );

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when user has null loggedOrganizationId', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithoutOrganization
      );

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should return false when user has undefined loggedOrganizationId', async () => {
      const userWithUndefinedOrgId = createMockUser({
        id: 3,
        email: 'test3@example.com',
        loggedOrganizationId: undefined as any,
      });
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        userWithUndefinedOrgId
      );

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should return true when user has any positive organization ID', async () => {
      const userWithOrgId5 = createMockUser({
        loggedOrganizationId: 5,
      });
      currentDbUserService.getCurrentDbUser.mockResolvedValue(userWithOrgId5);

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when user has zero loggedOrganizationId', async () => {
      const userWithZeroOrgId = createMockUser({
        loggedOrganizationId: 0,
      });
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        userWithZeroOrgId
      );

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should throw NotFoundException when no current user found', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      await expect(service.execute()).rejects.toThrow(
        new NotFoundException('No current user found')
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
    });

    it('should handle getCurrentDbUser service errors', async () => {
      currentDbUserService.getCurrentDbUser.mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(service.execute()).rejects.toThrow(
        'Database connection error'
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
    });
  });
});

// apps/api/src/resources/users/services/is-user-logged-in-organization/service.spec.ts
