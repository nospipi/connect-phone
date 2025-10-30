// apps/api/src/resources/esim-offers/services/update-esim-offer/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateEsimOfferService } from './service';
import { EsimOfferEntity } from '../../../../../database/entities/esim-offer.entity';
import { UpdateEsimOfferDto } from './update-esim-offer.dto';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockEsimOffer,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

describe('UpdateEsimOfferService', () => {
  let service: UpdateEsimOfferService;
  let esimOfferRepository: jest.Mocked<Repository<EsimOfferEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockEsimOffer = createMockEsimOffer();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEsimOfferService,
        {
          provide: getRepositoryToken(EsimOfferEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateEsimOfferService>(UpdateEsimOfferService);
    esimOfferRepository = module.get(getRepositoryToken(EsimOfferEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateEsimOffer', () => {
    it('should update esim offer successfully', async () => {
      const updateDto: UpdateEsimOfferDto = {
        id: 1,
        title: 'Updated Title',
        dataInGb: 10,
        isUnlimitedData: true,
      };

      const updatedEsimOffer = createMockEsimOffer({
        title: 'Updated Title',
        dataInGb: 10,
        isUnlimitedData: true,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(mockEsimOffer as any);
      esimOfferRepository.save.mockResolvedValue(updatedEsimOffer as any);

      const result = await service.updateEsimOffer(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(esimOfferRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(result.title).toBe('Updated Title');
      expect(result.dataInGb).toBe(10);
      expect(result.isUnlimitedData).toBe(true);
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateEsimOfferDto = {
        title: 'Updated Title',
      };

      await expect(service.updateEsimOffer(updateDto)).rejects.toThrow(
        new NotFoundException('Esim offer ID is required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateEsimOfferDto = {
        id: 1,
        title: 'Updated Title',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateEsimOffer(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );
    });

    it('should throw NotFoundException when esim offer does not exist', async () => {
      const updateDto: UpdateEsimOfferDto = {
        id: 999,
        title: 'Updated Title',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.updateEsimOffer(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Esim offer with ID 999 not found in current organization'
        )
      );
    });

    it('should update relations when relation IDs are provided', async () => {
      const updateDto: UpdateEsimOfferDto = {
        id: 1,
        inclusionIds: [1, 2, 3],
        countryIds: [5, 6],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(mockEsimOffer as any);
      esimOfferRepository.save.mockImplementation(
        async (entity) => entity as any
      );

      await service.updateEsimOffer(updateDto);

      const savedOffer = esimOfferRepository.save.mock.calls[0][0];
      expect(savedOffer.inclusions).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(savedOffer.countries).toEqual([{ id: 5 }, { id: 6 }]);
    });

    it('should handle database errors', async () => {
      const updateDto: UpdateEsimOfferDto = {
        id: 1,
        title: 'Updated Title',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.findOne.mockResolvedValue(mockEsimOffer as any);
      esimOfferRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.updateEsimOffer(updateDto)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
