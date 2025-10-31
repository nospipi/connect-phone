// apps/api/src/resources/prices/services/get-by-ids/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { validate } from 'class-validator';
import { GetPricesByIdsService } from './service';
import { GetPricesByIdsQueryDto } from './dto';
import { PriceEntity } from '@/database/entities/price.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockPrice,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//------------------------------------------------------------

describe('GetPricesByIdsService', () => {
  let service: GetPricesByIdsService;
  let priceRepository: jest.Mocked<Repository<PriceEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockPrices = [
    createMockPrice({ id: 1, name: 'Price A' }),
    createMockPrice({ id: 2, name: 'Price B' }),
    createMockPrice({ id: 3, name: 'Price C' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPricesByIdsService,
        {
          provide: getRepositoryToken(PriceEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetPricesByIdsService>(GetPricesByIdsService);
    priceRepository = module.get(getRepositoryToken(PriceEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPricesByIds', () => {
    it('should return prices matching provided IDs', async () => {
      const ids = [1, 2, 3];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.find.mockResolvedValue(mockPrices as PriceEntity[]);

      const result = await service.getPricesByIds(ids);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(priceRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockPrices);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no IDs are provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      priceRepository.find.mockResolvedValue([]);

      const result = await service.getPricesByIds([]);

      expect(priceRepository.find).toHaveBeenCalledWith({
        where: {
          id: In([]),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual([]);
    });

    it('should handle null organization', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      priceRepository.find.mockResolvedValue([]);

      await service.getPricesByIds(ids);

      expect(priceRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: undefined,
        },
        order: {
          name: 'ASC',
        },
      });
    });
  });

  describe('GetPricesByIdsQueryDto validation', () => {
    it('should validate successfully with valid comma-separated IDs', async () => {
      const dto = new GetPricesByIdsQueryDto();
      dto.ids = '1,2,3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with single ID', async () => {
      const dto = new GetPricesByIdsQueryDto();
      dto.ids = '1';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with IDs containing spaces', async () => {
      const dto = new GetPricesByIdsQueryDto();
      dto.ids = '1, 2, 3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when ids is empty', async () => {
      const dto = new GetPricesByIdsQueryDto();
      dto.ids = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });

    it('should fail validation when ids is not a string', async () => {
      const dto = new GetPricesByIdsQueryDto();
      (dto as any).ids = 123;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });
  });
});
