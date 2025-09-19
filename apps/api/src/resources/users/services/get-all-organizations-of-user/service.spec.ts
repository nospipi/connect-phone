// apps/api/src/resources/users/services/get-all-organizations-of-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { GetAllOrganizationsOfUserService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import {
  UserOrganizationEntity,
  UserOrganizationRole,
} from '../../../../database/entities/user-organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

//-------------------------------------------------------------------------------------------------

describe('GetAllOrganizationsOfUserService', () => {
  let service: GetAllOrganizationsOfUserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let userOrgRepository: jest.Mocked<Repository<UserOrganizationEntity>>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: null,
    userOrganizations: [],
    auditLogs: [],
  } as UserEntity;

  const mockOrganization1: OrganizationEntity = {
    id: 1,
    name: 'Organization 1',
    slug: 'org-1',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as OrganizationEntity;

  const mockOrganization2: OrganizationEntity = {
    id: 2,
    name: 'Organization 2',
    slug: 'org-2',
    logoUrl: 'https://example.com/logo.png',
    createdAt: '2024-01-02T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as OrganizationEntity;

  const mockUserOrganizations: UserOrganizationEntity[] = [
    {
      id: 1,
      userId: 1,
      organizationId: 1,
      role: UserOrganizationRole.ADMIN,
      user: mockUser,
      organization: mockOrganization1,
    } as UserOrganizationEntity,
    {
      id: 2,
      userId: 1,
      organizationId: 2,
      role: UserOrganizationRole.OPERATOR,
      user: mockUser,
      organization: mockOrganization2,
    } as UserOrganizationEntity,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllOrganizationsOfUserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
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

    service = module.get<GetAllOrganizationsOfUserService>(
      GetAllOrganizationsOfUserService
    );
    userRepository = module.get(getRepositoryToken(UserEntity));
    userOrgRepository = module.get(getRepositoryToken(UserOrganizationEntity));
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrganizationsOfCurrentUser', () => {
    it('should return organizations with roles for current user', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue(mockUserOrganizations);

      // Act
      const result = await service.getAllOrganizationsOfCurrentUser();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['organization'],
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...mockOrganization1,
        role: UserOrganizationRole.ADMIN,
      });
      expect(result[1]).toEqual({
        ...mockOrganization2,
        role: UserOrganizationRole.OPERATOR,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getAllOrganizationsOfCurrentUser()).rejects.toThrow(
        new UnauthorizedException('User not found in database')
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).not.toHaveBeenCalled();
    });

    it('should return empty array when user has no organizations', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getAllOrganizationsOfCurrentUser();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['organization'],
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockRejectedValue(
        new Error('Database connection error')
      );

      // Act & Assert
      await expect(service.getAllOrganizationsOfCurrentUser()).rejects.toThrow(
        'Database connection error'
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['organization'],
      });
    });

    it('should handle single organization correctly', async () => {
      // Arrange
      const singleUserOrg = [mockUserOrganizations[0]];
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue(singleUserOrg);

      // Act
      const result = await service.getAllOrganizationsOfCurrentUser();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockOrganization1,
        role: UserOrganizationRole.ADMIN,
      });
    });

    it('should preserve organization properties and add role', async () => {
      // Arrange
      const orgWithAllProps: OrganizationEntity = {
        id: 3,
        name: 'Full Props Org',
        slug: 'full-props',
        logoUrl: 'https://example.com/full.png',
        createdAt: '2024-01-03T00:00:00Z',
        salesChannels: [],
        userOrganizations: [],
        auditLogs: [],
      } as OrganizationEntity;

      const userOrgWithFullProps: UserOrganizationEntity = {
        id: 3,
        userId: 1,
        organizationId: 3,
        role: UserOrganizationRole.OPERATOR,
        user: mockUser,
        organization: orgWithAllProps,
      } as UserOrganizationEntity;

      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue([userOrgWithFullProps]);

      // Act
      const result = await service.getAllOrganizationsOfCurrentUser();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 3,
        name: 'Full Props Org',
        slug: 'full-props',
        logoUrl: 'https://example.com/full.png',
        createdAt: '2024-01-03T00:00:00Z',
        salesChannels: [],
        userOrganizations: [],
        auditLogs: [],
        role: UserOrganizationRole.OPERATOR,
      });
    });
  });
});
