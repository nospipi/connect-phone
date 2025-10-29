// apps/api/src/resources/sales-channels/services/get-by-ids/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { validate } from 'class-validator';
import { GetSalesChannelsByIdsService } from './service';
import { GetSalesChannelsByIdsQueryDto } from './dto';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockSalesChannel,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//------------------------------------------------------------

describe('GetSalesChannelsByIdsService', () => {
  let service: GetSalesChannelsByIdsService;
  let salesChannelRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockSalesChannels = [
    createMockSalesChannel({ id: 1, name: 'Channel A' }),
    createMockSalesChannel({ id: 2, name: 'Channel B' }),
    createMockSalesChannel({ id: 3, name: 'Channel C' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSalesChannelsByIdsService,
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetSalesChannelsByIdsService>(
      GetSalesChannelsByIdsService
    );
    salesChannelRepository = module.get(getRepositoryToken(SalesChannelEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalesChannelsByIds', () => {
    it('should return sales channels matching provided IDs', async () => {
      const ids = [1, 2, 3];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.find.mockResolvedValue(
        mockSalesChannels as SalesChannelEntity[]
      );

      const result = await service.getSalesChannelsByIds(ids);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockSalesChannels);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no IDs are provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.find.mockResolvedValue([]);

      const result = await service.getSalesChannelsByIds([]);

      expect(salesChannelRepository.find).toHaveBeenCalledWith({
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
      salesChannelRepository.find.mockResolvedValue([]);

      await service.getSalesChannelsByIds(ids);

      expect(salesChannelRepository.find).toHaveBeenCalledWith({
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

  describe('GetSalesChannelsByIdsQueryDto validation', () => {
    it('should validate successfully with valid comma-separated IDs', async () => {
      const dto = new GetSalesChannelsByIdsQueryDto();
      dto.ids = '1,2,3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with single ID', async () => {
      const dto = new GetSalesChannelsByIdsQueryDto();
      dto.ids = '1';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with IDs containing spaces', async () => {
      const dto = new GetSalesChannelsByIdsQueryDto();
      dto.ids = '1, 2, 3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when ids is empty', async () => {
      const dto = new GetSalesChannelsByIdsQueryDto();
      dto.ids = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });

    it('should fail validation when ids is not a string', async () => {
      const dto = new GetSalesChannelsByIdsQueryDto();
      (dto as any).ids = 123;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });
  });
});
