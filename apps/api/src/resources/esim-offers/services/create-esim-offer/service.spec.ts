// apps/api/src/resources/esim-offers/services/create-esim-offer/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { CreateEsimOfferService } from './service';
import { EsimOfferEntity } from '../../../../database/entities/esim-offer.entity';
import { CreateEsimOfferDto } from './create-esim-offer.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockEsimOffer,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//----------------------------------------------------------------------

describe('CreateEsimOfferService', () => {
  let service: CreateEsimOfferService;
  let esimOfferRepository: jest.Mocked<Repository<EsimOfferEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockEsimOffer = createMockEsimOffer({ organizationId: 31 });
  const mockCreateEsimOfferDto: CreateEsimOfferDto = {
    title: 'Greece 5GB 30 Days',
    descriptionHtml: '<p>Perfect for your Greek vacation</p>',
    descriptionText: 'Perfect for your Greek vacation',
    durationInDays: 30,
    dataInGb: 5,
    isUnlimitedData: false,
    inclusionIds: [1, 2],
    exclusionIds: [1],
    mainImageId: 1,
    imageIds: [1, 2],
    countryIds: [1],
    salesChannelIds: [1],
    priceIds: [1],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEsimOfferService,
        {
          provide: getRepositoryToken(EsimOfferEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateEsimOfferService>(CreateEsimOfferService);
    esimOfferRepository = module.get(getRepositoryToken(EsimOfferEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEsimOffer', () => {
    it('should create a new esim offer successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.create.mockReturnValue(mockEsimOffer as any);
      esimOfferRepository.save.mockResolvedValue(mockEsimOffer as any);

      const result = await service.createEsimOffer(mockCreateEsimOfferDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(esimOfferRepository.create).toHaveBeenCalledWith({
        title: 'Greece 5GB 30 Days',
        descriptionHtml: '<p>Perfect for your Greek vacation</p>',
        descriptionText: 'Perfect for your Greek vacation',
        durationInDays: 30,
        dataInGb: 5,
        isUnlimitedData: false,
        organizationId: 31,
        mainImageId: 1,
        inclusions: [{ id: 1 }, { id: 2 }],
        exclusions: [{ id: 1 }],
        images: [{ id: 1 }, { id: 2 }],
        countries: [{ id: 1 }],
        salesChannels: [{ id: 1 }],
        prices: [{ id: 1 }],
      });
      expect(esimOfferRepository.save).toHaveBeenCalledWith(mockEsimOffer);
      expect(result).toEqual(mockEsimOffer);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      esimOfferRepository.create.mockReturnValue(mockEsimOffer as any);
      esimOfferRepository.save.mockResolvedValue(mockEsimOffer as any);

      await service.createEsimOffer(mockCreateEsimOfferDto);

      expect(esimOfferRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: undefined,
        })
      );
    });

    it('should create without optional relations', async () => {
      const minimalDto: CreateEsimOfferDto = {
        title: 'Basic Offer',
        descriptionHtml: '<p>Basic</p>',
        descriptionText: 'Basic',
        durationInDays: 7,
        dataInGb: 1,
        isUnlimitedData: false,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.create.mockReturnValue(mockEsimOffer as any);
      esimOfferRepository.save.mockResolvedValue(mockEsimOffer as any);

      await service.createEsimOffer(minimalDto);

      expect(esimOfferRepository.create).toHaveBeenCalledWith({
        title: 'Basic Offer',
        descriptionHtml: '<p>Basic</p>',
        descriptionText: 'Basic',
        durationInDays: 7,
        dataInGb: 1,
        isUnlimitedData: false,
        organizationId: 31,
        mainImageId: null,
        inclusions: [],
        exclusions: [],
        images: [],
        countries: [],
        salesChannels: [],
        prices: [],
      });
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      esimOfferRepository.create.mockReturnValue(mockEsimOffer as any);
      esimOfferRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createEsimOffer(mockCreateEsimOfferDto)
      ).rejects.toThrow('Database error');
    });
  });

  describe('CreateEsimOfferDto validation', () => {
    it('should validate successfully with valid data', async () => {
      const dto = new CreateEsimOfferDto();
      dto.title = 'Greece eSIM';
      dto.descriptionHtml = '<p>Great for travel</p>';
      dto.descriptionText = 'Great for travel';
      dto.durationInDays = 30;
      dto.dataInGb = 5;
      dto.isUnlimitedData = false;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when title is empty', async () => {
      const dto = new CreateEsimOfferDto();
      dto.title = '';
      dto.descriptionHtml = '<p>Test</p>';
      dto.descriptionText = 'Test';
      dto.durationInDays = 30;
      dto.dataInGb = 5;
      dto.isUnlimitedData = false;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation when durationInDays is less than 1', async () => {
      const dto = new CreateEsimOfferDto();
      dto.title = 'Test';
      dto.descriptionHtml = '<p>Test</p>';
      dto.descriptionText = 'Test';
      dto.durationInDays = 0;
      dto.dataInGb = 5;
      dto.isUnlimitedData = false;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
