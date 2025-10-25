// apps/api/src/resources/offer-inclusions/services/get-all-by-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllByOrgPaginatedService } from './service';
import { OfferInclusionEntity } from '../../../../database/entities/offer-inclusion.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  createMockOrganization,
  createMockOfferInclusion,
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
  let offerInclusionRepository: jest.Mocked<Repository<OfferInclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockOfferInclusion = createMockOfferInclusion();
  const mockPaginationResult = createMockPagination(
    [mockOfferInclusion],
    '/offer-inclusions/paginated'
  );
  const mockQueryBuilder = createMockQueryBuilder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(OfferInclusionEntity),
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
    offerInclusionRepository = module.get(
      getRepositoryToken(OfferInclusionEntity)
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

  describe('getAllOfferInclusionsPaginated', () => {
    it('should return paginated offer inclusions for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.getAllOfferInclusionsPaginated(1, 10, '');

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerInclusionRepository.createQueryBuilder).toHaveBeenCalledWith(
        'offerInclusion'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'offerInclusion.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'offerInclusion.createdAt',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/offer-inclusions/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferInclusionsPaginated(1, 10, 'free shipping');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'offerInclusion.body ILIKE :search',
        { search: '%free shipping%' }
      );
    });

    it('should validate limit bounds', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.getAllOfferInclusionsPaginated(1, 150, '');

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/offer-inclusions/paginated',
      });
    });
  });
});
