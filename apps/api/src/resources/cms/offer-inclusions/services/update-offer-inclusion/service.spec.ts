// apps/api/src/resources/cms/offer-inclusions/services/update-offer-inclusion/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateOfferInclusionService } from './service';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { UpdateOfferInclusionDto } from './update-offer-inclusion.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferInclusion,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('UpdateOfferInclusionService', () => {
  let service: UpdateOfferInclusionService;
  let offerInclusionRepository: jest.Mocked<Repository<OfferInclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferInclusion = createMockOfferInclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOfferInclusionService,
        {
          provide: getRepositoryToken(OfferInclusionEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateOfferInclusionService>(
      UpdateOfferInclusionService
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

  describe('updateOfferInclusion', () => {
    it('should update offer inclusion successfully', async () => {
      const updateDto: UpdateOfferInclusionDto = {
        id: 1,
        body: 'Updated inclusion text',
      };

      const updatedOfferInclusion = {
        ...mockOfferInclusion,
        body: 'Updated inclusion text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.save.mockResolvedValue(updatedOfferInclusion);

      const result = await service.updateOfferInclusion(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerInclusionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(offerInclusionRepository.save).toHaveBeenCalled();
      expect(result.body).toBe('Updated inclusion text');
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateOfferInclusionDto = {
        body: 'Updated text',
      };

      await expect(service.updateOfferInclusion(updateDto)).rejects.toThrow(
        new NotFoundException('Offer inclusion ID is required')
      );
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateOfferInclusionDto = {
        id: 1,
        body: 'Updated text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateOfferInclusion(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );
    });

    it('should throw NotFoundException when offer inclusion does not exist', async () => {
      const updateDto: UpdateOfferInclusionDto = {
        id: 999,
        body: 'Updated text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.updateOfferInclusion(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Offer inclusion with ID 999 not found in current organization'
        )
      );
    });
  });
});
