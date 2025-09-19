// apps/api/src/resources/users/services/get-user-logged-in-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetUserLoggedInOrganizationService } from './service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';

//-------------------------------------------------------------------------------------------------

describe('GetUserLoggedInOrganizationService', () => {
  let service: GetUserLoggedInOrganizationService;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization: OrganizationEntity = {
    id: 1,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as OrganizationEntity;

  const mockUserWithOrganization: UserEntity = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
    userOrganizations: [],
    auditLogs: [],
  } as UserEntity;

  const mockUserWithoutOrganization: UserEntity = {
    id: 2,
    email: 'test2@example.com',
    firstName: 'Test2',
    lastName: 'User2',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: null,
    loggedOrganization: null,
    userOrganizations: [],
    auditLogs: [],
  } as UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserLoggedInOrganizationService,
        {
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
          },
        },
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
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithOrganization
      );

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrganization);
    });

    it('should return null when user has no logged organization', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(
        mockUserWithoutOrganization
      );

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
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

    it('should return organization with all properties intact', async () => {
      // Arrange
      const fullOrganization: OrganizationEntity = {
        id: 2,
        name: 'Full Organization',
        slug: 'full-org',
        logoUrl: 'https://example.com/logo.png',
        createdAt: '2024-01-02T00:00:00Z',
        salesChannels: [],
        userOrganizations: [],
        auditLogs: [],
      } as OrganizationEntity;

      const userWithFullOrg: UserEntity = {
        ...mockUserWithOrganization,
        id: 3,
        loggedOrganizationId: 2,
        loggedOrganization: fullOrganization,
      } as UserEntity;

      currentDbUserService.getCurrentDbUser.mockResolvedValue(userWithFullOrg);

      // Act
      const result = await service.execute();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: 2,
        name: 'Full Organization',
        slug: 'full-org',
        logoUrl: 'https://example.com/logo.png',
        createdAt: '2024-01-02T00:00:00Z',
        salesChannels: [],
        userOrganizations: [],
        auditLogs: [],
      });
    });
  });
});
