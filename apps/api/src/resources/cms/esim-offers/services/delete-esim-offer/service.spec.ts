// apps/api/src/resources/esim-offers/services/delete-esim-offer/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteEsimOfferService } from './service';
import { EsimOfferEntity } from '../../../../../database/entities/esim-offer.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockEsimOffer,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

describe('DeleteEsimOfferService', () => {
  let service: DeleteEsimOfferService;
  let esimOfferRepository: jest.Mocked<Repository<EsimOfferEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockEsimOffer = createMockEsimOffer();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteEsimOfferService,
        {
          provide: getRepositoryToken(EsimOfferEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteEsimOfferService>(DeleteEsimOfferService);
    esimOfferRepository = module.get(getRepositoryToken(EsimOfferEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteEsimOffer', () => {
    it('should delete esim offer successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(mockEsimOffer as any);
      esimOfferRepository.remove.mockResolvedValue(mockEsimOffer as any);

      const result = await service.deleteEsimOffer(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(esimOfferRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
      });
      expect(esimOfferRepository.remove).toHaveBeenCalledWith(mockEsimOffer);
      expect(result).toEqual(mockEsimOffer);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteEsimOffer(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(esimOfferRepository.findOne).not.toHaveBeenCalled();
      expect(esimOfferRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when esim offer does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteEsimOffer(999)).rejects.toThrow(
        new NotFoundException(
          'Esim offer with ID 999 not found in current organization'
        )
      );

      expect(esimOfferRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(mockEsimOffer as any);
      esimOfferRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteEsimOffer(1)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
