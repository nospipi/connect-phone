// apps/api/src/resources/offer-exclusions/services/get-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllByOrgPaginatedService } from './service';
import { OfferExclusionEntity } from '../../../../database/entities/offer-exclusion.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  createMockOrganization,
  createMockOfferExclusion,
  createMockQueryBuilder,
  createMockPagination,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//----------------------------------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllByOrgPaginatedService', () => {
  let service: GetAllByOrgPaginatedService;
  let offerExclusionRepository: jest.Mocked<Repository<OfferExclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockOfferExclusion = createMockOfferExclusion();
  const mockPaginationResult = createMockPagination(
    [mockOfferExclusion],
    '/offer-exclusions/paginated'
  );
  const mockQueryBuilder = createMockQueryBuilder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(OfferExclusionEntity),
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
    offerExclusionRepository = module.get(
      getRepositoryToken(OfferExclusionEntity)
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

  describe('getAllOfferExclusionsPaginated', () => {
    it('should return paginated offer exclusions for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.getAllOfferExclusionsPaginated(1, 10, '');

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerExclusionRepository.createQueryBuilder).toHaveBeenCalledWith(
        'offerExclusion'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'offerExclusion.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'offerExclusion.createdAt',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/offer-exclusions/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default parameter values', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated();

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/offer-exclusions/paginated',
      });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should validate limit bounds (minimum 1)', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated(1, 0);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 1,
        route: '/offer-exclusions/paginated',
      });
    });

    it('should validate limit bounds (maximum 100)', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated(1, 150);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/offer-exclusions/paginated',
      });
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated(1, 10, 'gift cards');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'offerExclusion.body ILIKE :search',
        { search: '%gift cards%' }
      );
    });

    it('should trim search term and handle spaces', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated(
        1,
        10,
        '  previous orders  '
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'offerExclusion.body ILIKE :search',
        { search: '%previous orders%' }
      );
    });

    it('should not add search when search term is empty or whitespace', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated(1, 10, '   ');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Object)
      );
    });

    it('should handle different page and limit values', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferExclusionsPaginated(3, 25, '');

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/offer-exclusions/paginated',
      });
    });
  });
});
