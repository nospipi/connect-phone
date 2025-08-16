// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { OrganizationContextService } from '../../../../common/core/organization-context.service';
import { paginate } from 'nestjs-typeorm-paginate';

//------------------------------------------

// Mock the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('FindAllByOrgPaginatedService', () => {
  let service: FindAllByOrgPaginatedService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannel>>;
  let organizationsRepository: jest.Mocked<Repository<Organization>>;
  let organizationContextService: jest.Mocked<OrganizationContextService>;

  const mockOrganization: Organization = {
    id: 31,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    users: [],
  };

  const mockSalesChannel: SalesChannel = {
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    logoUrl: null,
    organizationId: 31,
    organization: mockOrganization,
  };

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

    const mockOrganizationContextService = {
      getRequiredOrganization: jest.fn(),
      getCurrentOrganization: jest.fn(),
      getCurrentUser: jest.fn(),
      getRequiredUser: jest.fn(),
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
          provide: OrganizationContextService,
          useValue: mockOrganizationContextService,
        },
      ],
    }).compile();

    service = module.get<FindAllByOrgPaginatedService>(
      FindAllByOrgPaginatedService
    );
    salesChannelsRepository = module.get(getRepositoryToken(SalesChannel));
    organizationsRepository = module.get(getRepositoryToken(Organization));
    organizationContextService = module.get(OrganizationContextService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByOrganizationPaginated', () => {
    it('should return paginated sales channels for current organization', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const mockPaginatedResult = {
        items: [mockSalesChannel],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      (paginate as jest.Mock).mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await service.findAllByOrganizationPaginated(page, limit);

      // Assert
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'salesChannel'
      );
      expect(paginate).toHaveBeenCalled();
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should throw error when organization not found', async () => {
      // Arrange
      organizationContextService.getRequiredOrganization.mockRejectedValue(
        new NotFoundException('Organization not found')
      );

      // Act & Assert
      await expect(
        service.findAllByOrganizationPaginated(1, 10)
      ).rejects.toThrow(new NotFoundException('Organization not found'));
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(paginate).not.toHaveBeenCalled();
    });

    it('should validate limit bounds', async () => {
      // Arrange
      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      (paginate as jest.Mock).mockResolvedValue({ items: [], meta: {} });

      // Act
      await service.findAllByOrganizationPaginated(1, 200); // Limit > 100

      // Assert
      expect(paginate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 100, // Should be capped at 100
        })
      );
    });

    it('should use default values when not provided', async () => {
      // Arrange
      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      (paginate as jest.Mock).mockResolvedValue({ items: [], meta: {} });

      // Act
      await service.findAllByOrganizationPaginated();

      // Assert
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(paginate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          page: 1,
          limit: 10,
        })
      );
    });
  });

  describe('searchPaginated', () => {
    it('should search and return paginated results for current organization', async () => {
      // Arrange
      const searchTerm = 'test';
      const mockPaginatedResult = {
        items: [mockSalesChannel],
        meta: { totalItems: 1 },
      };

      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      (paginate as jest.Mock).mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await service.searchPaginated(searchTerm, 1, 10);

      // Assert
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'salesChannel'
      );
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('getPaginationStats', () => {
    it('should return pagination stats for current organization', async () => {
      // Arrange
      const totalCount = 25;
      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.count.mockResolvedValue(totalCount);

      // Act
      const result = await service.getPaginationStats();

      // Assert
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.count).toHaveBeenCalledWith({
        where: { organizationId: 31 },
      });
      expect(result).toEqual({
        organizationName: 'Test Organization',
        organizationId: 31,
        totalSalesChannels: 25,
        recommendedPageSize: 10,
        estimatedPages: 3,
      });
    });

    it('should recommend larger page size for many items', async () => {
      // Arrange
      const totalCount = 100;
      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.count.mockResolvedValue(totalCount);

      // Act
      const result = await service.getPaginationStats();

      // Assert
      expect(result.recommendedPageSize).toBe(20); // Should recommend 20 for > 50 items
      expect(result.estimatedPages).toBe(10); // 100 / 10 = 10
    });
  });

  describe('findAllByOrganizationPaginatedWithCustomOrder', () => {
    it('should return paginated results with custom ordering', async () => {
      // Arrange
      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      (paginate as jest.Mock).mockResolvedValue({ items: [], meta: {} });

      // Act
      await service.findAllByOrganizationPaginatedWithCustomOrder(
        1,
        10,
        'name',
        'ASC'
      );

      // Assert
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'salesChannel'
      );
      expect(paginate).toHaveBeenCalled();
    });
  });
});
