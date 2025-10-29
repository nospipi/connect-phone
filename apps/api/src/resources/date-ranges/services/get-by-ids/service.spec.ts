// apps/api/src/resources/date-ranges/services/get-by-ids/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GetDateRangesByIdsService } from './service';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockDateRange,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//------------------------------------------------------------

describe('GetDateRangesByIdsService', () => {
  let service: GetDateRangesByIdsService;
  let dateRangeRepository: jest.Mocked<Repository<DateRangeEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockDateRanges = [
    createMockDateRange({ id: 1, name: 'Q1 2025' }),
    createMockDateRange({ id: 2, name: 'Q2 2025' }),
    createMockDateRange({ id: 3, name: 'Q3 2025' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDateRangesByIdsService,
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetDateRangesByIdsService>(GetDateRangesByIdsService);
    dateRangeRepository = module.get(getRepositoryToken(DateRangeEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDateRangesByIds', () => {
    it('should return date ranges matching provided IDs', async () => {
      const ids = [1, 2, 3];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.find.mockResolvedValue(
        mockDateRanges as DateRangeEntity[]
      );

      const result = await service.getDateRangesByIds(ids);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dateRangeRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockDateRanges);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no IDs are provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.find.mockResolvedValue([]);

      const result = await service.getDateRangesByIds([]);

      expect(dateRangeRepository.find).toHaveBeenCalledWith({
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
      dateRangeRepository.find.mockResolvedValue([]);

      await service.getDateRangesByIds(ids);

      expect(dateRangeRepository.find).toHaveBeenCalledWith({
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
});
