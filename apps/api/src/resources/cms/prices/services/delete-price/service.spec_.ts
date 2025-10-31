// apps/api/src/resources/prices/services/delete-price/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeletePriceService } from './service';
import { PriceEntity } from '@/database/entities/price.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockPrice,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

describe('DeletePriceService', () => {
  let service: DeletePriceService;
  let priceRepository: jest.Mocked<Repository<PriceEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockPrice = createMockPrice();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePriceService,
        {
          provide: getRepositoryToken(PriceEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeletePriceService>(DeletePriceService);
    priceRepository = module.get(getRepositoryToken(PriceEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deletePrice', () => {
    it('should delete a price successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValue(mockPrice as any);
      priceRepository.remove.mockResolvedValue(mockPrice as any);

      const result = await service.deletePrice(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(priceRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
      });
      expect(priceRepository.remove).toHaveBeenCalledWith(mockPrice);
      expect(result).toEqual(mockPrice);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deletePrice(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(priceRepository.findOne).not.toHaveBeenCalled();
      expect(priceRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when price does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePrice(999)).rejects.toThrow(
        new NotFoundException(
          'Price with ID 999 not found in current organization'
        )
      );

      expect(priceRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
      });
      expect(priceRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.findOne.mockResolvedValue(mockPrice as any);
      priceRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.deletePrice(1)).rejects.toThrow('Database error');

      expect(priceRepository.remove).toHaveBeenCalledWith(mockPrice);
    });
  });
});
