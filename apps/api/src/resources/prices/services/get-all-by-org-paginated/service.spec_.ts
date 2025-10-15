// apps/api/src/resources/prices/services/get-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllByOrgPaginatedService } from './service';
import { PriceEntity } from '../../../../database/entities/price.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  createMockOrganization,
  createMockPrice,
  createMockQueryBuilder,
  createMockPagination,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllByOrgPaginatedService', () => {
  let service: GetAllByOrgPaginatedService;
  let priceRepository: jest.Mocked<Repository<PriceEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockPrice = createMockPrice();
  const mockPaginationResult = createMockPagination(
    [mockPrice],
    '/prices/paginated'
  );
  const mockQueryBuilder = createMockQueryBuilder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(PriceEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetAllByOrgPaginatedService>(
      GetAllByOrgPaginatedService
    );
    priceRepository = module.get(getRepositoryToken(PriceEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
    mockPaginate = paginate as jest.MockedFunction<typeof paginate>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPricesPaginated', () => {
    it('should return paginated prices for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.getAllPricesPaginated(1, 10, '');

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(priceRepository.createQueryBuilder).toHaveBeenCalledWith('price');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'price.dateRanges',
        'dateRanges'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'price.salesChannels',
        'salesChannels'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'price.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'price.createdAt',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/prices/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(1, 10, 'High Season');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.name ILIKE :search',
        { search: '%High Season%' }
      );
    });

    it('should validate limit bounds', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(1, 150);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/prices/paginated',
      });
    });
  });
});
