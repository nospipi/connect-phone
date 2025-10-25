// apps/api/src/resources/prices/services/get-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllByOrgPaginatedService } from './service';
import { PriceEntity } from '../../../../database/entities/price.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { Currency } from '@connect-phone/shared-types';
import { SearchPricesDto } from './search-prices.dto';
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
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        search: '',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.getAllPricesPaginated(searchDto);

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
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        search: 'High Season',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.name ILIKE :search',
        { search: '%High Season%' }
      );
    });

    it('should validate limit bounds', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 150,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/prices/paginated',
      });
    });

    it('should filter by minimum amount', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        minAmount: 10,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.amount >= :minAmount',
        { minAmount: 10 }
      );
    });

    it('should filter by maximum amount', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        maxAmount: 50,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.amount <= :maxAmount',
        { maxAmount: 50 }
      );
    });

    it('should filter by amount range', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        minAmount: 10,
        maxAmount: 50,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.amount >= :minAmount',
        { minAmount: 10 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.amount <= :maxAmount',
        { maxAmount: 50 }
      );
    });

    it('should filter by single currency', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        currencies: [Currency.USD],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.currency IN (:...currencies)',
        { currencies: [Currency.USD] }
      );
    });

    it('should filter by multiple currencies', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        currencies: [Currency.USD, Currency.EUR, Currency.GBP],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.currency IN (:...currencies)',
        { currencies: [Currency.USD, Currency.EUR, Currency.GBP] }
      );
    });

    it('should filter by single date range', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        dateRangeIds: [1],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'dateRanges.id IN (:...dateRangeIds)',
        { dateRangeIds: [1] }
      );
    });

    it('should filter by multiple date ranges', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        dateRangeIds: [1, 2, 3],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'dateRanges.id IN (:...dateRangeIds)',
        { dateRangeIds: [1, 2, 3] }
      );
    });

    it('should filter by single sales channel', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        salesChannelIds: [1],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'salesChannels.id IN (:...salesChannelIds)',
        { salesChannelIds: [1] }
      );
    });

    it('should filter by multiple sales channels', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        salesChannelIds: [1, 2, 3],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'salesChannels.id IN (:...salesChannelIds)',
        { salesChannelIds: [1, 2, 3] }
      );
    });

    it('should apply multiple filters simultaneously', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
        search: 'Season',
        minAmount: 10,
        maxAmount: 50,
        currencies: [Currency.USD, Currency.EUR],
        dateRangeIds: [1, 2],
        salesChannelIds: [1],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.name ILIKE :search',
        { search: '%Season%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.amount >= :minAmount',
        { minAmount: 10 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.amount <= :maxAmount',
        { maxAmount: 50 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'price.currency IN (:...currencies)',
        { currencies: [Currency.USD, Currency.EUR] }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'dateRanges.id IN (:...dateRangeIds)',
        { dateRangeIds: [1, 2] }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'salesChannels.id IN (:...salesChannelIds)',
        { salesChannelIds: [1] }
      );
    });

    it('should not apply filters when optional parameters are not provided', async () => {
      const searchDto: SearchPricesDto = {
        page: 1,
        limit: 10,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllPricesPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });
});
