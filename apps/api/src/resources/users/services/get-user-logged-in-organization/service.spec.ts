// apps/api/src/resources/users/services/get-user-logged-in-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetUserLoggedInOrganizationService } from './service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import {
  createMockOrganization,
  createMockUser,
  createCurrentDbUserServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('GetUserLoggedInOrganizationService', () => {
  let service: GetUserLoggedInOrganizationService;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization = createMockOrganization();
  const mockUserWithOrganization = createMockUser({
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
  });
  const mockUserWithoutOrganization = createMockUser({
    id: 2,
    email: 'test2@example.com',
    loggedOrganizationId: null,
    loggedOrganization: null,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserLoggedInOrganizationService,
        createCurrentDbUserServiceProvider(),
      ],
    }).compile();

    service = module.get<GetUserLoggedInOrganizationService>(
      GetUserLoggedInOrganizationService
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
    it('should return logged organization when user has one', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithOrganization
      );

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrganization);
    });

    it('should return null when user has no logged organization', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithoutOrganization
      );

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
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

    it('should return organization with all properties intact', async () => {
      const fullOrganization = createMockOrganization({
        id: 2,
        name: 'Full Organization',
        slug: 'full-org',
        logoId: 1,
        createdAt: '2024-01-02T00:00:00Z',
      });

      const userWithFullOrg = createMockUser({
        id: 3,
        loggedOrganizationId: 2,
        loggedOrganization: fullOrganization,
      });

      currentDbUserService.getCurrentDbUser.mockResolvedValue(userWithFullOrg);

      const result = await service.execute();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: 2,
        name: 'Full Organization',
        slug: 'full-org',
        logoId: 1,
        logo: null,
        createdAt: '2024-01-02T00:00:00Z',
        mainCurrency: 'USD',
        salesChannels: [],
        userOrganizations: [],
        auditLogs: [],
        countries: [],
        prices: [],
        dateRanges: [],
        media: [],
      });
    });
  });
});

// apps/api/src/resources/users/services/get-user-logged-in-organization/service.spec.ts
