// apps/api/src/resources/cms/offer-exclusions/services/create-offer-exclusion/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { CreateOfferExclusionService } from './service';
import { OfferExclusionEntity } from '@/database/entities/offer-exclusion.entity';
import { CreateOfferExclusionDto } from './create-offer-exclusion.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferExclusion,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('CreateOfferExclusionService', () => {
  let service: CreateOfferExclusionService;
  let offerExclusionRepository: jest.Mocked<Repository<OfferExclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockOfferExclusion = createMockOfferExclusion({ organizationId: 31 });
  const mockCreateOfferExclusionDto: CreateOfferExclusionDto = {
    body: 'Excludes previous orders and gift cards',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOfferExclusionService,
        {
          provide: getRepositoryToken(OfferExclusionEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateOfferExclusionService>(
      CreateOfferExclusionService
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

  describe('createOfferExclusion', () => {
    it('should create a new offer exclusion successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.create.mockReturnValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockResolvedValue(
        mockOfferExclusion as any
      );

      const result = await service.createOfferExclusion(
        mockCreateOfferExclusionDto
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerExclusionRepository.create).toHaveBeenCalledWith({
        body: 'Excludes previous orders and gift cards',
        organizationId: 31,
      });
      expect(offerExclusionRepository.save).toHaveBeenCalledWith(
        mockOfferExclusion
      );
      expect(result).toEqual(mockOfferExclusion);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      offerExclusionRepository.create.mockReturnValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockResolvedValue(
        mockOfferExclusion as any
      );

      const result = await service.createOfferExclusion(
        mockCreateOfferExclusionDto
      );

      expect(offerExclusionRepository.create).toHaveBeenCalledWith({
        body: 'Excludes previous orders and gift cards',
        organizationId: undefined,
      });
      expect(result).toEqual(mockOfferExclusion);
    });

    it('should handle different body content', async () => {
      const differentDto: CreateOfferExclusionDto = {
        body: 'Not valid with other promotions',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.create.mockReturnValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockResolvedValue(
        mockOfferExclusion as any
      );

      await service.createOfferExclusion(differentDto);

      expect(offerExclusionRepository.create).toHaveBeenCalledWith({
        body: 'Not valid with other promotions',
        organizationId: 31,
      });
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.create.mockReturnValue(
        mockOfferExclusion as any
      );
      offerExclusionRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createOfferExclusion(mockCreateOfferExclusionDto)
      ).rejects.toThrow('Database error');
    });
  });

  describe('CreateOfferExclusionDto validation', () => {
    it('should validate successfully with valid data', async () => {
      const dto = new CreateOfferExclusionDto();
      dto.body = 'Cannot be combined with other offers';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when body is empty', async () => {
      const dto = new CreateOfferExclusionDto();
      dto.body = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('body');
    });

    it('should validate successfully with long body text', async () => {
      const dto = new CreateOfferExclusionDto();
      dto.body = 'A'.repeat(500);

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
