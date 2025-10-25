// apps/api/src/resources/offer-inclusions/services/delete-offer-inclusion/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteOfferInclusionService } from './service';
import { OfferInclusionEntity } from '../../../../database/entities/offer-inclusion.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferInclusion,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//----------------------------------------------------------------------

describe('DeleteOfferInclusionService', () => {
  let service: DeleteOfferInclusionService;
  let offerInclusionRepository: jest.Mocked<Repository<OfferInclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferInclusion = createMockOfferInclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteOfferInclusionService,
        {
          provide: getRepositoryToken(OfferInclusionEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteOfferInclusionService>(
      DeleteOfferInclusionService
    );
    offerInclusionRepository = module.get(
      getRepositoryToken(OfferInclusionEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteOfferInclusion', () => {
    it('should delete an offer inclusion successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.remove.mockResolvedValue(
        mockOfferInclusion as any
      );

      const result = await service.deleteOfferInclusion(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerInclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
      });
      expect(offerInclusionRepository.remove).toHaveBeenCalledWith(
        mockOfferInclusion
      );
      expect(result).toEqual(mockOfferInclusion);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteOfferInclusion(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(offerInclusionRepository.findOne).not.toHaveBeenCalled();
      expect(offerInclusionRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer inclusion does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteOfferInclusion(999)).rejects.toThrow(
        new NotFoundException(
          'Offer inclusion with ID 999 not found in current organization'
        )
      );

      expect(offerInclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
      });
      expect(offerInclusionRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.remove.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteOfferInclusion(1)).rejects.toThrow(
        'Database error'
      );

      expect(offerInclusionRepository.remove).toHaveBeenCalledWith(
        mockOfferInclusion
      );
    });
  });
});
