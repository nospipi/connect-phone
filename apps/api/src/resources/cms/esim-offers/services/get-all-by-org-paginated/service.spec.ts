// apps/api/src/resources/cms/esim-offers/services/get-all-by-org-paginated/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllByOrgPaginatedService } from './service';
import { EsimOfferEntity } from '@/database/entities/esim-offer.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { SearchEsimOffersDto } from './search-esim-offers.dto';
import {
  createMockOrganization,
  createMockEsimOffer,
  createMockQueryBuilder,
  createMockPagination,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllByOrgPaginatedService', () => {
  let service: GetAllByOrgPaginatedService;
  let esimOfferRepository: jest.Mocked<Repository<EsimOfferEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockEsimOffer = createMockEsimOffer();
  const mockPaginationResult = createMockPagination(
    [mockEsimOffer],
    '/esim-offers/paginated'
  );
  const mockQueryBuilder = createMockQueryBuilder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllByOrgPaginatedService,
        {
          provide: getRepositoryToken(EsimOfferEntity),
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
    esimOfferRepository = module.get(getRepositoryToken(EsimOfferEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
    mockPaginate = paginate as jest.MockedFunction<typeof paginate>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllEsimOffersPaginated', () => {
    it('should return paginated esim offers for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const searchDto: SearchEsimOffersDto = {
        page: 1,
        limit: 10,
        search: '',
      };

      const result = await service.getAllEsimOffersPaginated(searchDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(esimOfferRepository.createQueryBuilder).toHaveBeenCalledWith(
        'esimOffer'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'esimOffer.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'esimOffer.id',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/esim-offers/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default parameter values', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const searchDto: SearchEsimOffersDto = {};

      await service.getAllEsimOffersPaginated(searchDto);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/esim-offers/paginated',
      });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should validate limit bounds', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const searchDto: SearchEsimOffersDto = {
        page: 1,
        limit: 150,
      };

      await service.getAllEsimOffersPaginated(searchDto);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/esim-offers/paginated',
      });
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const searchDto: SearchEsimOffersDto = {
        page: 1,
        limit: 10,
        search: 'Greece vacation',
      };

      await service.getAllEsimOffersPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(esimOffer.title ILIKE :search OR esimOffer.descriptionText ILIKE :search)',
        { search: '%Greece vacation%' }
      );
    });

    it('should not add search when search term is empty', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const searchDto: SearchEsimOffersDto = {
        page: 1,
        limit: 10,
        search: '   ',
      };

      await service.getAllEsimOffersPaginated(searchDto);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });
});
