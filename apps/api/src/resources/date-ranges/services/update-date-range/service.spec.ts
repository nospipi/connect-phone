// apps/api/src/resources/date-ranges/services/update-date-range/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateDateRangeService } from './service';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { UpdateDateRangeDto } from './update-date-range.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockDateRange,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('UpdateDateRangeService', () => {
  let service: UpdateDateRangeService;
  let dateRangeRepository: jest.Mocked<Repository<DateRangeEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockDateRange = createMockDateRange();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDateRangeService,
        {
          provide: getRepositoryToken(DateRangeEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateDateRangeService>(UpdateDateRangeService);
    dateRangeRepository = module.get(getRepositoryToken(DateRangeEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateDateRange', () => {
    it('should update a date range successfully', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Updated Q1 2025',
        startDate: '2025-01-05',
        endDate: '2025-04-05',
      };

      const updatedDateRange = {
        ...mockDateRange,
        name: 'Updated Q1 2025',
        startDate: '2025-01-05',
        endDate: '2025-04-05',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);
      dateRangeRepository.save.mockResolvedValue(updatedDateRange);

      const result = await service.updateDateRange(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(dateRangeRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Q1 2025');
      expect(result.startDate).toBe('2025-01-05');
      expect(result.endDate).toBe('2025-04-05');
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateDateRangeDto = {
        name: 'Updated Q1 2025',
      };

      await expect(service.updateDateRange(updateDto)).rejects.toThrow(
        new NotFoundException('Date range ID is required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).not.toHaveBeenCalled();
      expect(dateRangeRepository.findOne).not.toHaveBeenCalled();
      expect(dateRangeRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Updated Q1 2025',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateDateRange(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(dateRangeRepository.findOne).not.toHaveBeenCalled();
      expect(dateRangeRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when date range does not exist', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 999,
        name: 'Updated Q1 2025',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.updateDateRange(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 999 not found in current organization'
        )
      );

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, organizationId: 1 },
      });
      expect(dateRangeRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when date range belongs to different organization', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Updated Q1 2025',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.updateDateRange(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 1 not found in current organization'
        )
      );

      expect(dateRangeRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Updated Q1 2025',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);
      dateRangeRepository.save.mockImplementation(
        async (entity) => entity as any
      );

      await service.updateDateRange(updateDto);

      const savedDateRange = dateRangeRepository.save.mock.calls[0][0];
      expect(savedDateRange.name).toBe('Updated Q1 2025');
      expect(savedDateRange.startDate).toBe('2025-01-01');
      expect(savedDateRange.endDate).toBe('2025-03-31');
    });

    it('should update name when provided', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Holiday Season',
      };

      const updatedDateRange = {
        ...mockDateRange,
        name: 'Holiday Season',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange);
      dateRangeRepository.save.mockResolvedValue(updatedDateRange);

      const result = await service.updateDateRange(updateDto);

      expect(result.name).toBe('Holiday Season');
      expect(result.startDate).toBe('2025-01-01');
      expect(result.endDate).toBe('2025-03-31');
    });

    it('should update startDate when provided', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        startDate: '2025-01-15',
      };

      const updatedDateRange = {
        ...mockDateRange,
        startDate: '2025-01-15',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange);
      dateRangeRepository.save.mockResolvedValue(updatedDateRange);

      const result = await service.updateDateRange(updateDto);

      expect(result.startDate).toBe('2025-01-15');
      expect(result.name).toBe('Q1 2025');
      expect(result.endDate).toBe('2025-03-31');
    });

    it('should update endDate when provided', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        endDate: '2025-04-15',
      };

      const updatedDateRange = {
        ...mockDateRange,
        endDate: '2025-04-15',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange);
      dateRangeRepository.save.mockResolvedValue(updatedDateRange);

      const result = await service.updateDateRange(updateDto);

      expect(result.endDate).toBe('2025-04-15');
      expect(result.name).toBe('Q1 2025');
      expect(result.startDate).toBe('2025-01-01');
    });

    it('should handle database errors', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Updated Q1 2025',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      dateRangeRepository.findOne.mockResolvedValue(mockDateRange as any);
      dateRangeRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.updateDateRange(updateDto)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle different organization IDs correctly', async () => {
      const updateDto: UpdateDateRangeDto = {
        id: 1,
        name: 'Updated Q1 2025',
      };

      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      dateRangeRepository.findOne.mockResolvedValue(null);

      await expect(service.updateDateRange(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Date range with ID 1 not found in current organization'
        )
      );

      expect(dateRangeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 5 },
      });
    });
  });
});
