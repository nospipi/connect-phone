// apps/api/src/resources/audit-logs/services/find-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllByOrgPaginatedService } from './service';
import { AuditLogEntryEntity } from '../../../../database/entities/audit-log.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { IOrganization, IAuditLog } from '@connect-phone/shared-types';

// Mock paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('FindAllByOrgPaginatedService', () => {
  let service: FindAllByOrgPaginatedService;
  let auditLogsRepository: jest.Mocked<Repository<AuditLogEntryEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization: IOrganization = {
    id: 1,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as IOrganization;

  const mockAuditLog: IAuditLog = {
    id: 1,
    table_name: 'sales_channels',
    row_id: '1',
    operation: 'INSERT',
    before: null,
    after: { name: 'Test Channel' },
    organizationId: 1,
    organization: mockOrganization,
    userId: 1,
    user: null,
    created_at: new Date(),
  } as IAuditLog;

  const mockPaginationResult = {
    items: [mockAuditLog],
    meta: {
      itemCount: 1,
      totalItems: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
    links: {
      first: '/audit-logs/paginated?page=1&limit=10',
      previous: '',
      next: '',
      last: '/audit-logs/paginated?page=1&limit=10',
    },
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(AuditLogEntryEntity),
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

    service = module.get<FindAllByOrgPaginatedService>(
      FindAllByOrgPaginatedService
    );
    auditLogsRepository = module.get(getRepositoryToken(AuditLogEntryEntity));
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
    it('should return paginated audit logs for current organization', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAllByOrganizationPaginated(1, 10);

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(auditLogsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'auditLog'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'auditLog.organization',
        'organization'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'auditLog.user',
        'user'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'auditLog.organizationId = :organizationId',
        {
          organizationId: 1,
        }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'auditLog.id',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/audit-logs/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default page and limit values', async () => {
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
        route: '/audit-logs/paginated',
      });
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
        route: '/audit-logs/paginated',
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
        route: '/audit-logs/paginated',
      });
    });

    it('should handle different page and limit values', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(3, 25);

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/audit-logs/paginated',
      });
    });
  });
});
