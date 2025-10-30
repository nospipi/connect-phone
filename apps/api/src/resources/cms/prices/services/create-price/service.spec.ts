// apps/api/src/resources/prices/services/create-price/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePriceService } from './service';
import { PriceEntity } from '../../../../../database/entities/price.entity';
import { DateRangeEntity } from '../../../../../database/entities/date-range.entity';
import { SalesChannelEntity } from '../../../../../database/entities/sales-channel.entity';
import { CreatePriceDto } from './create-price.dto';
import { Currency } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockPrice,
  createMockDateRange,
  createMockSalesChannel,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

describe('CreatePriceService', () => {
  let service: CreatePriceService;
  let priceRepository: jest.Mocked<Repository<PriceEntity>>;
  let dateRangeRepository: jest.Mocked<Repository<DateRangeEntity>>;
  let salesChannelRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockPrice = createMockPrice({ organizationId: 31 });
  const mockDateRange1 = createMockDateRange({ id: 1 });
  const mockDateRange2 = createMockDateRange({ id: 2 });
  const mockSalesChannel1 = createMockSalesChannel({ id: 1 });
  const mockSalesChannel2 = createMockSalesChannel({ id: 2 });

  const mockQueryBuilder = {
    relation: jest.fn().mockReturnThis(),
    of: jest.fn().mockReturnThis(),
    add: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePriceService,
        {
          provide: getRepositoryToken(PriceEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            findByIds: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            findByIds: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreatePriceService>(CreatePriceService);
    priceRepository = module.get(getRepositoryToken(PriceEntity));
    dateRangeRepository = module.get(getRepositoryToken(DateRangeEntity));
    salesChannelRepository = module.get(getRepositoryToken(SalesChannelEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPrice', () => {
    it('should create a non-date-based price successfully', async () => {
      const createDto: CreatePriceDto = {
        name: 'Test Price',
        amount: 10.0,
        currency: Currency.USD,
        isDateBased: false,
        salesChannelIds: [1, 2],
        dateRangeIds: [],
      };

      const priceWithRelations = {
        ...mockPrice,
        salesChannels: [mockSalesChannel1, mockSalesChannel2],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
        mockSalesChannel2 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(priceWithRelations as any);

      const result = await service.createPrice(createDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(priceRepository.create).toHaveBeenCalledWith({
        name: 'Test Price',
        amount: 10.0,
        currency: Currency.USD,
        isDateBased: false,
        organizationId: 31,
      });
      expect(priceRepository.save).toHaveBeenCalledWith(mockPrice);
      expect(salesChannelRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(mockQueryBuilder.relation).toHaveBeenCalledWith(
        PriceEntity,
        'salesChannels'
      );
      expect(mockQueryBuilder.of).toHaveBeenCalledWith(mockPrice);
      expect(mockQueryBuilder.add).toHaveBeenCalledWith([
        mockSalesChannel1,
        mockSalesChannel2,
      ]);
      expect(priceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['organization', 'dateRanges', 'salesChannels'],
      });
      expect(result).toEqual(priceWithRelations);
    });

    it('should create a date-based price with date ranges successfully', async () => {
      const createDto: CreatePriceDto = {
        name: 'Seasonal Price',
        amount: 25.0,
        currency: Currency.EUR,
        isDateBased: true,
        salesChannelIds: [1],
        dateRangeIds: [1, 2],
      };

      const priceWithRelations = {
        ...mockPrice,
        name: 'Seasonal Price',
        amount: 25.0,
        currency: Currency.EUR,
        isDateBased: true,
        dateRanges: [mockDateRange1, mockDateRange2],
        salesChannels: [mockSalesChannel1],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      dateRangeRepository.findByIds.mockResolvedValue([
        mockDateRange1 as any,
        mockDateRange2 as any,
      ]);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(priceWithRelations as any);

      const result = await service.createPrice(createDto);

      expect(priceRepository.create).toHaveBeenCalledWith({
        name: 'Seasonal Price',
        amount: 25.0,
        currency: Currency.EUR,
        isDateBased: true,
        organizationId: 31,
      });
      expect(dateRangeRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(mockQueryBuilder.relation).toHaveBeenCalledWith(
        PriceEntity,
        'dateRanges'
      );
      expect(mockQueryBuilder.add).toHaveBeenCalledWith([
        mockDateRange1,
        mockDateRange2,
      ]);
      expect(salesChannelRepository.findByIds).toHaveBeenCalledWith([1]);
      expect(result).toEqual(priceWithRelations);
    });

    it('should create price with undefined organizationId when organization is null', async () => {
      const createDto: CreatePriceDto = {
        name: 'Test Price',
        amount: 10.0,
        currency: Currency.USD,
        isDateBased: false,
        salesChannelIds: [1],
        dateRangeIds: [],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(mockPrice as any);

      await service.createPrice(createDto);

      expect(priceRepository.create).toHaveBeenCalledWith({
        name: 'Test Price',
        amount: 10.0,
        currency: Currency.USD,
        isDateBased: false,
        organizationId: undefined,
      });
    });

    it('should not add date ranges when isDateBased is false', async () => {
      const createDto: CreatePriceDto = {
        name: 'Fixed Price',
        amount: 15.0,
        currency: Currency.GBP,
        isDateBased: false,
        salesChannelIds: [1],
        dateRangeIds: [1, 2],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(mockPrice as any);

      await service.createPrice(createDto);

      expect(dateRangeRepository.findByIds).not.toHaveBeenCalled();
    });

    it('should not add date ranges when dateRangeIds is empty', async () => {
      const createDto: CreatePriceDto = {
        name: 'Seasonal Price',
        amount: 20.0,
        currency: Currency.USD,
        isDateBased: true,
        salesChannelIds: [1],
        dateRangeIds: [],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(mockPrice as any);

      await service.createPrice(createDto);

      expect(dateRangeRepository.findByIds).not.toHaveBeenCalled();
    });

    it('should handle multiple sales channels', async () => {
      const createDto: CreatePriceDto = {
        name: 'Multi-Channel Price',
        amount: 30.0,
        currency: Currency.USD,
        isDateBased: false,
        salesChannelIds: [1, 2],
        dateRangeIds: [],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
        mockSalesChannel2 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(mockPrice as any);

      await service.createPrice(createDto);

      expect(salesChannelRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(mockQueryBuilder.add).toHaveBeenCalledWith([
        mockSalesChannel1,
        mockSalesChannel2,
      ]);
    });

    it('should throw NotFoundException when price not found after creation', async () => {
      const createDto: CreatePriceDto = {
        name: 'Test Price',
        amount: 10.0,
        currency: Currency.USD,
        isDateBased: false,
        salesChannelIds: [1],
        dateRangeIds: [],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(null);

      await expect(service.createPrice(createDto)).rejects.toThrow(
        new NotFoundException('Price not found after creation')
      );
    });

    it('should handle database errors during save', async () => {
      const createDto: CreatePriceDto = {
        name: 'Test Price',
        amount: 10.0,
        currency: Currency.USD,
        isDateBased: false,
        salesChannelIds: [1],
        dateRangeIds: [],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createPrice(createDto)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle different currencies correctly', async () => {
      const createDto: CreatePriceDto = {
        name: 'JPY Price',
        amount: 1000.0,
        currency: Currency.JPY,
        isDateBased: false,
        salesChannelIds: [1],
        dateRangeIds: [],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(mockPrice as any);

      await service.createPrice(createDto);

      expect(priceRepository.create).toHaveBeenCalledWith({
        name: 'JPY Price',
        amount: 1000.0,
        currency: Currency.JPY,
        isDateBased: false,
        organizationId: 31,
      });
    });

    it('should return price with all relations populated', async () => {
      const createDto: CreatePriceDto = {
        name: 'Complete Price',
        amount: 50.0,
        currency: Currency.USD,
        isDateBased: true,
        salesChannelIds: [1, 2],
        dateRangeIds: [1, 2],
      };

      const fullPriceWithRelations = {
        ...mockPrice,
        organization: mockOrganization,
        dateRanges: [mockDateRange1, mockDateRange2],
        salesChannels: [mockSalesChannel1, mockSalesChannel2],
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.create.mockReturnValue(mockPrice as any);
      priceRepository.save.mockResolvedValue(mockPrice as any);
      dateRangeRepository.findByIds.mockResolvedValue([
        mockDateRange1 as any,
        mockDateRange2 as any,
      ]);
      salesChannelRepository.findByIds.mockResolvedValue([
        mockSalesChannel1 as any,
        mockSalesChannel2 as any,
      ]);
      priceRepository.findOne.mockResolvedValue(fullPriceWithRelations as any);

      const result = await service.createPrice(createDto);

      expect(result.organization).toBeDefined();
      expect(result.dateRanges).toHaveLength(2);
      expect(result.salesChannels).toHaveLength(2);
    });
  });
});
