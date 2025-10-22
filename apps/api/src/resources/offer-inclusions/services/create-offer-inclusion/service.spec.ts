// apps/api/src/resources/offer-inclusions/services/create-offer-inclusion/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { CreateOfferInclusionService } from './service';
import { OfferInclusionEntity } from '../../../../database/entities/offer-inclusion.entity';
import { CreateOfferInclusionDto } from './create-offer-inclusion.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockOfferInclusion,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//----------------------------------------------------------------------

describe('CreateOfferInclusionService', () => {
  let service: CreateOfferInclusionService;
  let offerInclusionRepository: jest.Mocked<Repository<OfferInclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockOfferInclusion = createMockOfferInclusion({ organizationId: 31 });
  const mockCreateOfferInclusionDto: CreateOfferInclusionDto = {
    body: 'Free shipping on orders over $50',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOfferInclusionService,
        {
          provide: getRepositoryToken(OfferInclusionEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateOfferInclusionService>(
      CreateOfferInclusionService
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

  describe('createOfferInclusion', () => {
    it('should create a new offer inclusion successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.create.mockReturnValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.save.mockResolvedValue(
        mockOfferInclusion as any
      );

      const result = await service.createOfferInclusion(
        mockCreateOfferInclusionDto
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerInclusionRepository.create).toHaveBeenCalledWith({
        body: 'Free shipping on orders over $50',
        organizationId: 31,
      });
      expect(offerInclusionRepository.save).toHaveBeenCalledWith(
        mockOfferInclusion
      );
      expect(result).toEqual(mockOfferInclusion);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      offerInclusionRepository.create.mockReturnValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.save.mockResolvedValue(
        mockOfferInclusion as any
      );

      const result = await service.createOfferInclusion(
        mockCreateOfferInclusionDto
      );

      expect(offerInclusionRepository.create).toHaveBeenCalledWith({
        body: 'Free shipping on orders over $50',
        organizationId: undefined,
      });
      expect(result).toEqual(mockOfferInclusion);
    });

    it('should handle different body content', async () => {
      const differentDto: CreateOfferInclusionDto = {
        body: '24/7 customer support included',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.create.mockReturnValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.save.mockResolvedValue(
        mockOfferInclusion as any
      );

      await service.createOfferInclusion(differentDto);

      expect(offerInclusionRepository.create).toHaveBeenCalledWith({
        body: '24/7 customer support included',
        organizationId: 31,
      });
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.create.mockReturnValue(
        mockOfferInclusion as any
      );
      offerInclusionRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createOfferInclusion(mockCreateOfferInclusionDto)
      ).rejects.toThrow('Database error');
    });
  });

  describe('CreateOfferInclusionDto validation', () => {
    it('should validate successfully with valid data', async () => {
      const dto = new CreateOfferInclusionDto();
      dto.body = 'Free shipping on all orders';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when body is empty', async () => {
      const dto = new CreateOfferInclusionDto();
      dto.body = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('body');
    });

    it('should validate successfully with long body text', async () => {
      const dto = new CreateOfferInclusionDto();
      dto.body = 'A'.repeat(500);

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
