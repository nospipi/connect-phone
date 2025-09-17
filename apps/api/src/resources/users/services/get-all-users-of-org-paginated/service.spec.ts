// apps/api/src/resources/users/services/get-all-users-of-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllUsersOfOrgPaginatedService } from './service';
import {
  UserOrganization,
  //UserOrganizationRole,
} from '../../../../database/entities/user-organization.entity';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '../../../../database/entities/user.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';

//--------------------------------------------------------------------------------------------------

// Mock paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllUsersOfOrgPaginatedService', () => {
  let service: GetAllUsersOfOrgPaginatedService;
  let userOrganizationRepository: jest.Mocked<Repository<UserOrganization>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization: Organization = {
    id: 1,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as Organization;

  const mockUser: User = {
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
  } as User;

  const mockUserOrganization: UserOrganization = {
    id: 1,
    userId: 1,
    organizationId: 1,
    role: UserOrganizationRole.ADMIN,
    user: mockUser,
    organization: mockOrganization,
  } as UserOrganization;

  const mockPaginationResult = {
    items: [mockUserOrganization],
    meta: {
      itemCount: 1,
      totalItems: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
    links: {
      first: '/users/paginated?page=1&limit=10',
      previous: '',
      next: '',
      last: '/users/paginated?page=1&limit=10',
    },
  };

  const mockQueryBuilder = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersOfOrgPaginatedService,
        {
          provide: getRepositoryToken(UserOrganization),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: CurrentOrganizationService,
          useValue: {
            getCurrentOrganization: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetAllUsersOfOrgPaginatedService>(
      GetAllUsersOfOrgPaginatedService
    );
    userOrganizationRepository = module.get(
      getRepositoryToken(UserOrganization)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
    mockPaginate = paginate as jest.MockedFunction<typeof paginate>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByOrganizationPaginated', () => {
    it('should return paginated users for current organization', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAllByOrganizationPaginated(
        1,
        10,
        '',
        'all'
      );

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(
        userOrganizationRepository.createQueryBuilder
      ).toHaveBeenCalledWith('userOrganization');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'userOrganization.user',
        'user'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'userOrganization.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'userOrganization.id',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/users/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default parameter values', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated();

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/users/paginated',
      });
      // Should not call andWhere for search or role since they're defaults
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should validate limit bounds (minimum 1)', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 0);

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 1, // Should be corrected to minimum of 1
        route: '/users/paginated',
      });
    });

    it('should validate limit bounds (maximum 100)', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 150);

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100, // Should be corrected to maximum of 100
        route: '/users/paginated',
      });
    });

    it('should add search functionality when search term provided', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, 'john', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: '%john%' }
      );
    });

    it('should trim search term and handle spaces', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(
        1,
        10,
        '  jane doe  ',
        'all'
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: '%jane doe%' }
      );
    });

    it('should not add search when search term is empty or whitespace', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '   ', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Object)
      );
    });

    it('should add role filtering when role is specified', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'admin');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userOrganization.role = :role',
        { role: 'ADMIN' }
      );
    });

    it('should handle role case insensitively', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'OpErAtOr');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userOrganization.role = :role',
        { role: 'OPERATOR' }
      );
    });

    it('should not add role filtering when role is "all"', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'userOrganization.role = :role',
        expect.any(Object)
      );
    });

    it('should handle both search and role filtering together', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, 'test user', 'admin');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: '%test user%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'userOrganization.role = :role',
        { role: 'ADMIN' }
      );
    });

    it('should handle different page and limit values', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(3, 25, '', 'all');

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/users/paginated',
      });
    });
  });
});
