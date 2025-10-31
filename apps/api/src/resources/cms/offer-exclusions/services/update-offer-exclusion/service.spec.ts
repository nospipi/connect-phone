// apps/api/src/resources/offer-exclusions/services/update-offer-exclusion/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { validate } from 'class-validator';
import { UpdateOfferExclusionService } from './service';
import { OfferExclusionEntity } from '@/database/entities/offer-exclusion.entity';
import { UpdateOfferExclusionDto } from './update-offer-exclusion.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferExclusion,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('UpdateOfferExclusionService', () => {
  let service: UpdateOfferExclusionService;
  let offerExclusionRepository: jest.Mocked<Repository<OfferExclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferExclusion = createMockOfferExclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOfferExclusionService,
        {
          provide: getRepositoryToken(OfferExclusionEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateOfferExclusionService>(
      UpdateOfferExclusionService
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

  describe('updateOfferExclusion', () => {
    it('should update an offer exclusion successfully', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 1,
        body: 'Updated exclusion text',
      };

      const updatedOfferExclusion = {
        ...mockOfferExclusion,
        body: 'Updated exclusion text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockResolvedValue(updatedOfferExclusion);

      const result = await service.updateOfferExclusion(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(offerExclusionRepository.save).toHaveBeenCalled();
      expect(result.body).toBe('Updated exclusion text');
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        body: 'Updated text',
      };

      await expect(service.updateOfferExclusion(updateDto)).rejects.toThrow(
        new NotFoundException('Offer exclusion ID is required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).not.toHaveBeenCalled();
      expect(offerExclusionRepository.findOne).not.toHaveBeenCalled();
      expect(offerExclusionRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 1,
        body: 'Updated text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateOfferExclusion(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(offerExclusionRepository.findOne).not.toHaveBeenCalled();
      expect(offerExclusionRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer exclusion does not exist', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 999,
        body: 'Updated text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.updateOfferExclusion(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 999 not found in current organization'
        )
      );

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, organizationId: 1 },
      });
      expect(offerExclusionRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when offer exclusion belongs to different organization', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 1,
        body: 'Updated text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.updateOfferExclusion(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 1 not found in current organization'
        )
      );

      expect(offerExclusionRepository.save).not.toHaveBeenCalled();
    });

    it('should update only body field when provided', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 1,
        body: 'New exclusion text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockImplementation(
        async (entity) => entity as any
      );

      await service.updateOfferExclusion(updateDto);

      const savedOfferExclusion =
        offerExclusionRepository.save.mock.calls[0][0];
      expect(savedOfferExclusion.body).toBe('New exclusion text');
    });

    it('should handle database errors during save', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 1,
        body: 'Updated text',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.findOne.mockResolvedValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.updateOfferExclusion(updateDto)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle different organization IDs correctly', async () => {
      const updateDto: UpdateOfferExclusionDto = {
        id: 1,
        body: 'Updated text',
      };

      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      offerExclusionRepository.findOne.mockResolvedValue(null);

      await expect(service.updateOfferExclusion(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Offer exclusion with ID 1 not found in current organization'
        )
      );

      expect(offerExclusionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 5 },
      });
    });
  });

  describe('UpdateOfferExclusionDto validation', () => {
    it('should validate successfully with valid data', async () => {
      const dto = new UpdateOfferExclusionDto();
      dto.id = 1;
      dto.body = 'Cannot be combined with other offers';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with only body update', async () => {
      const dto = new UpdateOfferExclusionDto();
      dto.id = 1;
      dto.body = 'Updated exclusion';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with long body text', async () => {
      const dto = new UpdateOfferExclusionDto();
      dto.id = 1;
      dto.body = 'A'.repeat(500);

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
