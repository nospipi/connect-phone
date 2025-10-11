// apps/api/src/resources/date-ranges/services/get-date-range-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetDateRangeByIdService } from './service';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockDateRange,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('GetDateRangeByIdService', () => {
  let service: GetDateRangeByIdService;
  let dateRangeRepository: jest.Mocked<Repository<DateRangeEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockDateRange = createMockDateRange();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDateRangeByIdService,
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetDateRangeByIdService>(GetDateRangeByIdService);
    dateRangeRepository = module.get(getRepositoryToken(DateRangeEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDateRangeById', () => {
    it('should return date range when it exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);

      const result = await service.getDateRangeById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result).toEqual(mockDateRange);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getDateRangeById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(dateRangeRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when date range does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.getDateRangeById(999)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 999 not found in current organization'
        )
      );

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should throw NotFoundException when date range belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.getDateRangeById(1)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 1 not found in current organization'
        )
      );

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle different date range IDs correctly', async () => {
      const dateRangeId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);

      await service.getDateRangeById(dateRangeId);

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: dateRangeId,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle database errors during lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getDateRangeById(1)).rejects.toThrow(
        'Database error'
      );

      expect(dateRangeRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return date range with complete relations', async () => {
      const dateRangeWithRelations = {
        ...mockDateRange,
        organization: mockOrganization,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(dateRangeWithRelations);

      const result = await service.getDateRangeById(1);

      expect(result).toEqual(dateRangeWithRelations);
      expect(result.organization).toEqual(mockOrganization);
    });

    it('should handle date ranges with different properties', async () => {
      const differentDateRange = createMockDateRange({
        id: 2,
        name: 'Holiday Period',
        startDate: '2025-12-20',
        endDate: '2026-01-05',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(differentDateRange as any);

      const result = await service.getDateRangeById(2);

      expect(result).toEqual(differentDateRange);
      expect(result.name).toBe('Holiday Period');
      expect(result.startDate).toBe('2025-12-20');
      expect(result.endDate).toBe('2026-01-05');
    });
  });
});
