// apps/api/src/resources/offer-exclusions/services/delete-offer-exclusion/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteOfferExclusionService } from './service';
import { OfferExclusionEntity } from '../../../../database/entities/offer-exclusion.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockOfferExclusion,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//----------------------------------------------------------------------

describe('DeleteOfferExclusionService', () => {
  let service: DeleteOfferExclusionService;
  let offerExclusionRepository: jest.Mocked<Repository<OfferExclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferExclusion = createMockOfferExclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteOfferExclusionService,
        {
          provide: getRepositoryToken(OfferExclusionEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteOfferExclusionService>(
      DeleteOfferExclusionService
    );
    offerExclusionRepository = module.get(
      getRepositoryToken(OfferExclusionEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteOfferExclusion', () => {
    it('should delete an offer exclusion successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.remove.mockResolvedValue(
        mockOfferExclusion as any
      );

      const result = await service.deleteOfferExclusion(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
      });
      expect(offerExclusionRepository.remove).toHaveBeenCalledWith(
        mockOfferExclusion
      );
      expect(result).toEqual(mockOfferExclusion);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteOfferExclusion(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(offerExclusionRepository.findOne).not.toHaveBeenCalled();
      expect(offerExclusionRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer exclusion does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteOfferExclusion(999)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 999 not found in current organization'
        )
      );

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
      });
      expect(offerExclusionRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer exclusion belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteOfferExclusion(1)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 1 not found in current organization'
        )
      );

      expect(offerExclusionRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle different offer exclusion IDs correctly', async () => {
      const offerExclusionId = 999;
      const differentOfferExclusion = createMockOfferExclusion({
        id: offerExclusionId,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        differentOfferExclusion as any
      );
      offerExclusionRepository.remove.mockResolvedValue(
        differentOfferExclusion as any
      );

      const result = await service.deleteOfferExclusion(offerExclusionId);

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: offerExclusionId,
          organizationId: 1,
        },
      });
      expect(result.id).toBe(offerExclusionId);
    });

    it('should handle database errors during lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteOfferExclusion(1)).rejects.toThrow(
        'Database error'
      );

      expect(offerExclusionRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.remove.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteOfferExclusion(1)).rejects.toThrow(
        'Database error'
      );

      expect(offerExclusionRepository.remove).toHaveBeenCalledWith(
        mockOfferExclusion
      );
    });
  });
});
