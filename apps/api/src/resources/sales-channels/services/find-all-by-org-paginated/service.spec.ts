// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllByOrgPaginatedService } from './service';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { ISalesChannel } from '@connect-phone/shared-types';
import {
  createMockOrganization,
  createMockSalesChannel,
} from '../../../../test/factories';

//-------------------------------------------------------------------------------------

// Mock paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('FindAllByOrgPaginatedService', () => {
  let service: FindAllByOrgPaginatedService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();

  const mockSalesChannel: ISalesChannel = createMockSalesChannel({
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    logoUrl: null,
    organizationId: 1,
    organization: mockOrganization,
  });

  const mockPaginationResult = {
    items: [mockSalesChannel],
    meta: {
      itemCount: 1,
      totalItems: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
    links: {
      first: '/sales-channels/paginated?page=1&limit=10',
      previous: '',
      next: '',
      last: '/sales-channels/paginated?page=1&limit=10',
    },
  };

  const mockQueryBuilder = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(SalesChannelEntity),
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
    salesChannelsRepository = module.get(
      getRepositoryToken(SalesChannelEntity)
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
    it('should return paginated sales channels for current organization', async () => {
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
      expect(salesChannelsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'salesChannel'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'salesChannel.organization',
        'organization'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'salesChannel.organizationId = :organizationId',
        {
          organizationId: 1,
        }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'salesChannel.id',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/sales-channels/paginated',
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
        route: '/sales-channels/paginated',
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
        route: '/sales-channels/paginated',
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
        route: '/sales-channels/paginated',
      });
    });
  });
});
