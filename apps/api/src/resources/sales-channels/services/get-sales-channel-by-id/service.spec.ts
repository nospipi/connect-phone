// apps/api/src/resources/sales-channels/services/get-sales-channel-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetSalesChannelByIdService } from './service';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { ISalesChannel } from '@connect-phone/shared-types';
import {
  createMockOrganization,
  createMockSalesChannel,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

describe('GetSalesChannelByIdService', () => {
  let service: GetSalesChannelByIdService;
  let salesChannelRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();

  const mockSalesChannel: ISalesChannel = createMockSalesChannel({
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    logoUrl: null,
    organizationId: 1,
    isActive: true,
    organization: mockOrganization,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSalesChannelByIdService,
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetSalesChannelByIdService>(
      GetSalesChannelByIdService
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

  describe('getSalesChannelById', () => {
    it('should return sales channel when it exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );

      const result = await service.getSalesChannelById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getSalesChannelById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(salesChannelRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when sales channel does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(null);

      await expect(service.getSalesChannelById(999)).rejects.toThrow(
        new NotFoundException(
          'Sales channel with ID 999 not found in current organization'
        )
      );

      expect(salesChannelRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should throw NotFoundException when sales channel belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(null);

      await expect(service.getSalesChannelById(1)).rejects.toThrow(
        new NotFoundException(
          'Sales channel with ID 1 not found in current organization'
        )
      );

      expect(salesChannelRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle different sales channel IDs correctly', async () => {
      const salesChannelId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );

      await service.getSalesChannelById(salesChannelId);

      expect(salesChannelRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: salesChannelId,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle database errors during sales channel lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getSalesChannelById(1)).rejects.toThrow(
        'Database error'
      );

      expect(salesChannelRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return sales channel with complete relations', async () => {
      const salesChannelWithRelations = {
        ...mockSalesChannel,
        organization: mockOrganization,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        salesChannelWithRelations as SalesChannelEntity
      );

      const result = await service.getSalesChannelById(1);

      expect(result).toEqual(salesChannelWithRelations);
      expect(result.organization).toEqual(mockOrganization);
    });

    it('should handle sales channels with different properties', async () => {
      const differentSalesChannel: ISalesChannel = createMockSalesChannel({
        id: 2,
        name: 'Different Channel',
        description: 'Different description',
        logoUrl: 'https://example.com/logo.png',
        organizationId: 1,
        isActive: false,
        organization: mockOrganization,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        differentSalesChannel as SalesChannelEntity
      );

      const result = await service.getSalesChannelById(2);

      expect(result).toEqual(differentSalesChannel);
      expect(result.name).toBe('Different Channel');
      expect(result.isActive).toBe(false);
      expect(result.logoUrl).toBe('https://example.com/logo.png');
    });
  });
});
