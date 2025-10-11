// apps/api/src/resources/date-ranges/services/create-date-range/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { CreateDateRangeService } from './service';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { CreateDateRangeDto } from './create-date-range.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockDateRange,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('CreateDateRangeService', () => {
  let service: CreateDateRangeService;
  let dateRangeRepository: jest.Mocked<Repository<DateRangeEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockDateRange = createMockDateRange({ organizationId: 31 });
  const mockCreateDateRangeDto: CreateDateRangeDto = {
    name: 'Q1 2025',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDateRangeService,
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateDateRangeService>(CreateDateRangeService);
    dateRangeRepository = module.get(getRepositoryToken(DateRangeEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDateRange', () => {
    it('should create a new date range successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.create.mockReturnValue(mockDateRange as any);
      dateRangeRepository.save.mockResolvedValue(mockDateRange as any);

      const result = await service.createDateRange(mockCreateDateRangeDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dateRangeRepository.create).toHaveBeenCalledWith({
        name: 'Q1 2025',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        organizationId: 31,
      });
      expect(dateRangeRepository.save).toHaveBeenCalledWith(mockDateRange);
      expect(result).toEqual(mockDateRange);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      dateRangeRepository.create.mockReturnValue(mockDateRange as any);
      dateRangeRepository.save.mockResolvedValue(mockDateRange as any);

      const result = await service.createDateRange(mockCreateDateRangeDto);

      expect(dateRangeRepository.create).toHaveBeenCalledWith({
        name: 'Q1 2025',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        organizationId: undefined,
      });
      expect(result).toEqual(mockDateRange);
    });

    it('should handle different date range data', async () => {
      const differentDto: CreateDateRangeDto = {
        name: 'Holiday Period',
        startDate: '2025-12-20',
        endDate: '2026-01-05',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.create.mockReturnValue(mockDateRange as any);
      dateRangeRepository.save.mockResolvedValue(mockDateRange as any);

      await service.createDateRange(differentDto);

      expect(dateRangeRepository.create).toHaveBeenCalledWith({
        name: 'Holiday Period',
        startDate: '2025-12-20',
        endDate: '2026-01-05',
        organizationId: 31,
      });
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.create.mockReturnValue(mockDateRange as any);
      dateRangeRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createDateRange(mockCreateDateRangeDto)
      ).rejects.toThrow('Database error');
    });
  });

  describe('CreateDateRangeDto validation', () => {
    it('should validate successfully with valid data', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = 'Q1 2025';
      dto.startDate = '2025-01-01';
      dto.endDate = '2025-03-31';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully when endDate equals startDate', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = 'Single Day';
      dto.startDate = '2025-01-01';
      dto.endDate = '2025-01-01';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when endDate is before startDate', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = 'Invalid Range';
      dto.startDate = '2025-03-31';
      dto.endDate = '2025-01-01';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endDate');
      expect(errors[0].constraints).toHaveProperty('isEndDateAfterStart');
    });

    it('should fail validation when name is empty', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = '';
      dto.startDate = '2025-01-01';
      dto.endDate = '2025-03-31';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation when startDate format is invalid', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = 'Q1 2025';
      dto.startDate = '2025/01/01';
      dto.endDate = '2025-03-31';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('startDate');
    });

    it('should fail validation when endDate format is invalid', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = 'Q1 2025';
      dto.startDate = '2025-01-01';
      dto.endDate = '2025/03/31';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endDate');
    });

    it('should validate successfully with date range spanning years', async () => {
      const dto = new CreateDateRangeDto();
      dto.name = 'Holiday Period';
      dto.startDate = '2025-12-20';
      dto.endDate = '2026-01-05';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
