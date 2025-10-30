// apps/api/src/resources/offer-exclusions/services/get-offer-exclusion-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetOfferExclusionByIdService } from './service';
import { OfferExclusionEntity } from '../../../../../database/entities/offer-exclusion.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferExclusion,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

describe('GetOfferExclusionByIdService', () => {
  let service: GetOfferExclusionByIdService;
  let offerExclusionRepository: jest.Mocked<Repository<OfferExclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferExclusion = createMockOfferExclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOfferExclusionByIdService,
        {
          provide: getRepositoryToken(OfferExclusionEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetOfferExclusionByIdService>(
      GetOfferExclusionByIdService
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

  describe('getOfferExclusionById', () => {
    it('should return offer exclusion when it exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );

      const result = await service.getOfferExclusionById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result).toEqual(mockOfferExclusion);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getOfferExclusionById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(offerExclusionRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer exclusion does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.getOfferExclusionById(999)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 999 not found in current organization'
        )
      );

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should throw NotFoundException when offer exclusion belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.getOfferExclusionById(1)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 1 not found in current organization'
        )
      );

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle different offer exclusion IDs correctly', async () => {
      const offerExclusionId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );

      await service.getOfferExclusionById(offerExclusionId);

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: offerExclusionId,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle database errors during lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getOfferExclusionById(1)).rejects.toThrow(
        'Database error'
      );

      expect(offerExclusionRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return offer exclusion with complete relations', async () => {
      const offerExclusionWithRelations = {
        ...mockOfferExclusion,
        organization: mockOrganization,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        offerExclusionWithRelations
      );

      const result = await service.getOfferExclusionById(1);

      expect(result).toEqual(offerExclusionWithRelations);
      expect(result.organization).toEqual(mockOrganization);
    });

    it('should handle offer exclusions with different properties', async () => {
      const differentOfferExclusion = createMockOfferExclusion({
        id: 2,
        body: 'Cannot be combined with sale items',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        differentOfferExclusion as any
      );

      const result = await service.getOfferExclusionById(2);

      expect(result).toEqual(differentOfferExclusion);
      expect(result.body).toBe('Cannot be combined with sale items');
    });
  });
});
