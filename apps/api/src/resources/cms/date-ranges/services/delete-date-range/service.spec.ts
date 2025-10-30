// apps/api/src/resources/date-ranges/services/delete-date-range/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteDateRangeService } from './service';
import { DateRangeEntity } from '../../../../../database/entities/date-range.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockDateRange,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//--------------------------------------------------------------------------------

describe('DeleteDateRangeService', () => {
  let service: DeleteDateRangeService;
  let dateRangeRepository: jest.Mocked<Repository<DateRangeEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockDateRange = createMockDateRange();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteDateRangeService,
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteDateRangeService>(DeleteDateRangeService);
    dateRangeRepository = module.get(getRepositoryToken(DateRangeEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteDateRange', () => {
    it('should delete a date range successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);
      dateRangeRepository.remove.mockResolvedValue(mockDateRange as any);

      const result = await service.deleteDateRange(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
      });
      expect(dateRangeRepository.remove).toHaveBeenCalledWith(mockDateRange);
      expect(result).toEqual(mockDateRange);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteDateRange(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(dateRangeRepository.findOne).not.toHaveBeenCalled();
      expect(dateRangeRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when date range does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteDateRange(999)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 999 not found in current organization'
        )
      );

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
      });
      expect(dateRangeRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when date range belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteDateRange(1)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 1 not found in current organization'
        )
      );

      expect(dateRangeRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle different date range IDs correctly', async () => {
      const dateRangeId = 999;
      const differentDateRange = createMockDateRange({ id: dateRangeId });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(differentDateRange as any);
      dateRangeRepository.remove.mockResolvedValue(differentDateRange as any);

      const result = await service.deleteDateRange(dateRangeId);

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: dateRangeId,
          organizationId: 1,
        },
      });
      expect(result.id).toBe(dateRangeId);
    });

    it('should handle database errors during lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteDateRange(1)).rejects.toThrow(
        'Database error'
      );

      expect(dateRangeRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);
      dateRangeRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteDateRange(1)).rejects.toThrow(
        'Database error'
      );

      expect(dateRangeRepository.remove).toHaveBeenCalledWith(mockDateRange);
    });
  });
});
