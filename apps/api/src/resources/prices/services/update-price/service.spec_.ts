// apps/api/src/resources/prices/services/update-price/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdatePriceService } from './service';
import { PriceEntity } from '../../../../database/entities/price.entity';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { UpdatePriceDto } from './update-price.dto';
import { Currency } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockPrice,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('UpdatePriceService', () => {
  let service: UpdatePriceService;
  let priceRepository: jest.Mocked<Repository<PriceEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockPrice = createMockPrice();

  const mockQueryBuilder = {
    relation: jest.fn().mockReturnThis(),
    of: jest.fn().mockReturnThis(),
    addAndRemove: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePriceService,
        {
          provide: getRepositoryToken(PriceEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            findByIds: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            findByIds: jest.fn(),
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdatePriceService>(UpdatePriceService);
    priceRepository = module.get(getRepositoryToken(PriceEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updatePrice', () => {
    it('should update a price successfully', async () => {
      const updateDto: UpdatePriceDto = {
        id: 1,
        name: 'Updated Price',
        amount: 15.0,
      };

      const updatedPrice = {
        ...mockPrice,
        name: 'Updated Price',
        amount: 15.0,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValueOnce(mockPrice as any);
      priceRepository.save.mockResolvedValue(updatedPrice as any);
      priceRepository.findOne.mockResolvedValueOnce(updatedPrice as any);

      const result = await service.updatePrice(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(priceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(priceRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Price');
      expect(result.amount).toBe(15.0);
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdatePriceDto = {
        name: 'Updated Price',
      };

      await expect(service.updatePrice(updateDto)).rejects.toThrow(
        new NotFoundException('Price ID is required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdatePriceDto = {
        id: 1,
        name: 'Updated Price',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updatePrice(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(priceRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when price does not exist', async () => {
      const updateDto: UpdatePriceDto = {
        id: 999,
        name: 'Updated Price',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValue(null);

      await expect(service.updatePrice(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Price with ID 999 not found in current organization'
        )
      );

      expect(priceRepository.save).not.toHaveBeenCalled();
    });
  });
});
