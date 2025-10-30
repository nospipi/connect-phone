// apps/api/src/resources/esim-offers/services/get-esim-offer-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetEsimOfferByIdService } from './service';
import { EsimOfferEntity } from '../../../../../database/entities/esim-offer.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockEsimOffer,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

describe('GetEsimOfferByIdService', () => {
  let service: GetEsimOfferByIdService;
  let esimOfferRepository: jest.Mocked<Repository<EsimOfferEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockEsimOffer = createMockEsimOffer();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEsimOfferByIdService,
        {
          provide: getRepositoryToken(EsimOfferEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetEsimOfferByIdService>(GetEsimOfferByIdService);
    esimOfferRepository = module.get(getRepositoryToken(EsimOfferEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEsimOfferById', () => {
    it('should return esim offer with all relations', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(mockEsimOffer as any);

      const result = await service.getEsimOfferById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(esimOfferRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: [
          'organization',
          'inclusions',
          'exclusions',
          'mainImage',
          'images',
          'countries',
          'salesChannels',
          'prices',
        ],
      });
      expect(result).toEqual(mockEsimOffer);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getEsimOfferById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(esimOfferRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when esim offer does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.getEsimOfferById(999)).rejects.toThrow(
        new NotFoundException(
          'Esim offer with ID 999 not found in current organization'
        )
      );
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getEsimOfferById(1)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
