// apps/api/src/resources/cms/users/services/get-all-users-of-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllUsersOfOrgPaginatedService } from './service';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  createMockOrganization,
  createMockUser,
  createMockUserOrganization,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllUsersOfOrgPaginatedService', () => {
  let service: GetAllUsersOfOrgPaginatedService;
  let userOrganizationRepository: jest.Mocked<
    Repository<UserOrganizationEntity>
  >;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockUser = createMockUser();
  const mockUserOrganization = createMockUserOrganization();
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
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetAllUsersOfOrgPaginatedService>(
      GetAllUsersOfOrgPaginatedService
    );
    userOrganizationRepository = module.get(
      getRepositoryToken(UserOrganizationEntity)
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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.findAllByOrganizationPaginated(
        1,
        10,
        '',
        'all'
      );

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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated();

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/users/paginated',
      });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should validate limit bounds (minimum 1)', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 0);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 1,
        route: '/users/paginated',
      });
    });

    it('should validate limit bounds (maximum 100)', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 150);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/users/paginated',
      });
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, 'john', 'all');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: '%john%' }
      );
    });

    it('should trim search term and handle spaces', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(
        1,
        10,
        '  jane doe  ',
        'all'
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: '%jane doe%' }
      );
    });

    it('should not add search when search term is empty or whitespace', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '   ', 'all');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Object)
      );
    });

    it('should add role filtering when role is specified', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '', 'admin');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userOrganization.role = :role',
        { role: 'ADMIN' }
      );
    });

    it('should handle role case insensitively', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '', 'OpErAtOr');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userOrganization.role = :role',
        { role: 'OPERATOR' }
      );
    });

    it('should not add role filtering when role is "all"', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '', 'all');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'userOrganization.role = :role',
        expect.any(Object)
      );
    });

    it('should handle both search and role filtering together', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, 'test user', 'admin');

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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(3, 25, '', 'all');

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/users/paginated',
      });
    });
  });
});

// apps/api/src/resources/cms/users/services/get-all-users-of-org-paginated/service.spec.ts
