// apps/api/src/resources/esim-offers/services/get-by-ids/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { validate } from 'class-validator';
import { GetEsimOffersByIdsService } from './service';
import { GetEsimOffersByIdsQueryDto } from './dto';
import { EsimOfferEntity } from '@/database/entities/esim-offer.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockEsimOffer,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//------------------------------------------------------------

describe('GetEsimOffersByIdsService', () => {
  let service: GetEsimOffersByIdsService;
  let esimOfferRepository: jest.Mocked<Repository<EsimOfferEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockEsimOffers = [
    createMockEsimOffer({ id: 1, title: 'Offer A' }),
    createMockEsimOffer({ id: 2, title: 'Offer B' }),
    createMockEsimOffer({ id: 3, title: 'Offer C' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEsimOffersByIdsService,
        {
          provide: getRepositoryToken(EsimOfferEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetEsimOffersByIdsService>(GetEsimOffersByIdsService);
    esimOfferRepository = module.get(getRepositoryToken(EsimOfferEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEsimOffersByIds', () => {
    it('should return esim offers matching provided IDs', async () => {
      const ids = [1, 2, 3];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.find.mockResolvedValue(
        mockEsimOffers as EsimOfferEntity[]
      );

      const result = await service.getEsimOffersByIds(ids);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(esimOfferRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          title: 'ASC',
        },
      });
      expect(result).toEqual(mockEsimOffers);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no IDs are provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.find.mockResolvedValue([]);

      const result = await service.getEsimOffersByIds([]);

      expect(esimOfferRepository.find).toHaveBeenCalledWith({
        where: {
          id: In([]),
          organizationId: 1,
        },
        order: {
          title: 'ASC',
        },
      });
      expect(result).toEqual([]);
    });

    it('should handle null organization', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      esimOfferRepository.find.mockResolvedValue([]);

      await service.getEsimOffersByIds(ids);

      expect(esimOfferRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: undefined,
        },
        order: {
          title: 'ASC',
        },
      });
    });
  });

  describe('GetEsimOffersByIdsQueryDto validation', () => {
    it('should validate successfully with valid comma-separated IDs', async () => {
      const dto = new GetEsimOffersByIdsQueryDto();
      dto.ids = '1,2,3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with single ID', async () => {
      const dto = new GetEsimOffersByIdsQueryDto();
      dto.ids = '1';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with IDs containing spaces', async () => {
      const dto = new GetEsimOffersByIdsQueryDto();
      dto.ids = '1, 2, 3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when ids is empty', async () => {
      const dto = new GetEsimOffersByIdsQueryDto();
      dto.ids = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });

    it('should fail validation when ids is not a string', async () => {
      const dto = new GetEsimOffersByIdsQueryDto();
      (dto as any).ids = 123;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });
  });
});
