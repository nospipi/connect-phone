// apps/api/src/resources/cms/users/services/get-all-organizations-of-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { GetAllOrganizationsOfUserService } from './service';
import { UserEntity } from '@/database/entities/user.entity';
import {
  UserOrganizationEntity,
  UserOrganizationRole,
} from '@/database/entities/user-organization.entity';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';
import {
  createMockUser,
  createMockOrganization,
  createMockUserOrganization,
  createCurrentDbUserServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

describe('GetAllOrganizationsOfUserService', () => {
  let service: GetAllOrganizationsOfUserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let userOrgRepository: jest.Mocked<Repository<UserOrganizationEntity>>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockUser = createMockUser();
  const mockOrganization1 = createMockOrganization();
  const mockOrganization2 = createMockOrganization({
    id: 2,
    name: 'Organization 2',
    slug: 'org-2',
    logoId: 1,
    createdAt: '2024-01-02T00:00:00Z',
  });
  const mockUserOrganizations = [
    createMockUserOrganization({
      role: UserOrganizationRole.ADMIN,
      organization: mockOrganization1,
    }),
    createMockUserOrganization({
      id: 2,
      organizationId: 2,
      role: UserOrganizationRole.OPERATOR,
      organization: mockOrganization2,
    }),
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
        createCurrentDbUserServiceProvider(),
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
    it('should return organizations with roles and logo relation for current user', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue(mockUserOrganizations);

      const result = await service.getAllOrganizationsOfCurrentUser();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['organization', 'organization.logo'],
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
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      await expect(service.getAllOrganizationsOfCurrentUser()).rejects.toThrow(
        new UnauthorizedException('User not found in database')
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).not.toHaveBeenCalled();
    });

    it('should return empty array when user has no organizations', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue([]);

      const result = await service.getAllOrganizationsOfCurrentUser();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['organization', 'organization.logo'],
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database error gracefully', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(service.getAllOrganizationsOfCurrentUser()).rejects.toThrow(
        'Database connection error'
      );

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userOrgRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['organization', 'organization.logo'],
      });
    });

    it('should handle single organization correctly', async () => {
      const singleUserOrg = [mockUserOrganizations[0]];
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue(singleUserOrg);

      const result = await service.getAllOrganizationsOfCurrentUser();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockOrganization1,
        role: UserOrganizationRole.ADMIN,
      });
    });

    it('should preserve organization properties and add role', async () => {
      const orgWithAllProps = createMockOrganization({
        id: 3,
        name: 'Full Props Org',
        slug: 'full-props',
        logoId: 1,
        createdAt: '2024-01-03T00:00:00Z',
      });

      const userOrgWithFullProps = createMockUserOrganization({
        id: 3,
        organizationId: 3,
        role: UserOrganizationRole.OPERATOR,
        organization: orgWithAllProps,
      });

      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userOrgRepository.find.mockResolvedValue([userOrgWithFullProps]);

      const result = await service.getAllOrganizationsOfCurrentUser();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 3,
        name: 'Full Props Org',
        slug: 'full-props',
        logoId: 1,
        logo: null,
        createdAt: '2024-01-03T00:00:00Z',
        mainCurrency: 'USD',
        salesChannels: [],
        userOrganizations: [],
        auditLogs: [],
        countries: [],
        prices: [],
        dateRanges: [],
        media: [],
        offerInclusions: [],
        offerExclusions: [],
        role: UserOrganizationRole.OPERATOR,
      });
    });
  });
});
