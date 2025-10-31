// apps/api/src/resources/prices/services/get-price-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetPriceByIdService } from './service';
import { PriceEntity } from '@/database/entities/price.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockPrice,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

describe('GetPriceByIdService', () => {
  let service: GetPriceByIdService;
  let priceRepository: jest.Mocked<Repository<PriceEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockPrice = createMockPrice();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPriceByIdService,
        {
          provide: getRepositoryToken(PriceEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetPriceByIdService>(GetPriceByIdService);
    priceRepository = module.get(getRepositoryToken(PriceEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPriceById', () => {
    it('should return price when it exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValue(mockPrice as any);

      const result = await service.getPriceById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(priceRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization', 'dateRanges', 'salesChannels'],
      });
      expect(result).toEqual(mockPrice);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getPriceById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(priceRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when price does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValue(null);

      await expect(service.getPriceById(999)).rejects.toThrow(
        new NotFoundException(
          'Price with ID 999 not found in current organization'
        )
      );

      expect(priceRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
        relations: ['organization', 'dateRanges', 'salesChannels'],
      });
    });
  });
});
