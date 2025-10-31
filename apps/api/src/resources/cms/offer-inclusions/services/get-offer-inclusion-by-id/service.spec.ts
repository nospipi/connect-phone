// apps/api/src/resources/cms/offer-inclusions/services/get-offer-inclusion-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetOfferInclusionByIdService } from './service';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferInclusion,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('GetOfferInclusionByIdService', () => {
  let service: GetOfferInclusionByIdService;
  let offerInclusionRepository: jest.Mocked<Repository<OfferInclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferInclusion = createMockOfferInclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOfferInclusionByIdService,
        {
          provide: getRepositoryToken(OfferInclusionEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetOfferInclusionByIdService>(
      GetOfferInclusionByIdService
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

  describe('getOfferInclusionById', () => {
    it('should return offer inclusion when it exists', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(
        mockOfferInclusion as any
      );

      const result = await service.getOfferInclusionById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerInclusionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result).toEqual(mockOfferInclusion);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getOfferInclusionById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(offerInclusionRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer inclusion does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.getOfferInclusionById(999)).rejects.toThrow(
        new NotFoundException(
          'Offer inclusion with ID 999 not found in current organization'
        )
      );
    });
  });
});
