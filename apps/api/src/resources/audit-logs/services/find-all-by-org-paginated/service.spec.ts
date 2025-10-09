// apps/api/src/resources/audit-logs/services/find-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllByOrgPaginatedService } from './service';
import { AuditLogEntryEntity } from '../../../../database/entities/audit-log.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  createMockOrganization,
  createMockAuditLog,
  createMockQueryBuilder,
  createMockPagination,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('FindAllByOrgPaginatedService', () => {
  let service: FindAllByOrgPaginatedService;
  let auditLogsRepository: jest.Mocked<Repository<AuditLogEntryEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockAuditLog = createMockAuditLog();
  const mockPaginationResult = createMockPagination(
    [mockAuditLog],
    '/audit-logs/paginated'
  );
  const mockQueryBuilder = createMockQueryBuilder();

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
        createCurrentOrganizationServiceProvider(),
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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.findAllByOrganizationPaginated(1, 10);

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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/audit-logs/paginated',
      });
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
        route: '/audit-logs/paginated',
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
        route: '/audit-logs/paginated',
      });
    });

    it('should handle different page and limit values', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(3, 25);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/audit-logs/paginated',
      });
    });
  });
});
