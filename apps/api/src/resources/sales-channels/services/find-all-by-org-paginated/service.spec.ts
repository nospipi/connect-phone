// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '../../../../database/entities/user.entity';
import {
  UserOrganization,
  UserOrganizationRole,
} from '../../../../database/entities/user-organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { paginate } from 'nestjs-typeorm-paginate';

// Mock paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('FindAllByOrgPaginatedService', () => {
  let service: FindAllByOrgPaginatedService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannel>>;
  let organizationsRepository: jest.Mocked<Repository<Organization>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization: Organization = {
    id: 31,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
  } as unknown as Organization;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 31,
    loggedOrganization: mockOrganization,
    userOrganizations: [
      {
        id: 1,
        user: {} as User,
        organization: mockOrganization,
        organizationId: 31,
        userId: 1,
        role: UserOrganizationRole.ADMIN,
      },
    ],
  } as unknown as User;

  const mockSalesChannel: SalesChannel = {
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    logoUrl: null,
    organizationId: 31,
    organization: mockOrganization,
  } as SalesChannel;

  beforeEach(async () => {
    const mockSalesChannelsRepository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      }),
      count: jest.fn(),
    };

    const mockOrganizationsRepository = {
      findOne: jest.fn(),
    };

    const mockCurrentOrganizationService = {
      getCurrentOrganization: jest.fn(),
    };

    const mockCurrentDbUserService = {
      getCurrentDbUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(SalesChannel),
          useValue: mockSalesChannelsRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrganizationsRepository,
        },
        {
          provide: getRepositoryToken(UserOrganization),
          useValue: {}, // If your service injects this, provide a mock
        },
        {
          provide: CurrentOrganizationService,
          useValue: mockCurrentOrganizationService,
        },
        {
          provide: CurrentDbUserService,
          useValue: mockCurrentDbUserService,
        },
      ],
    }).compile();

    service = module.get<FindAllByOrgPaginatedService>(
      FindAllByOrgPaginatedService
    );
    salesChannelsRepository = module.get(getRepositoryToken(SalesChannel));
    organizationsRepository = module.get(getRepositoryToken(Organization));
    currentOrganizationService = module.get(CurrentOrganizationService);
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Keep your describe('findAllByOrganizationPaginated', ...) tests mostly the same,
  // just make sure to use mockOrganization.userOrganizations instead of mockOrganization.users
});
