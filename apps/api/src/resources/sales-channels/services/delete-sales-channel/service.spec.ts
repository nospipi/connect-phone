// apps/api/src/resources/sales-channels/services/delete-sales-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteSalesChannelService } from './service';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockSalesChannel,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

describe('DeleteSalesChannelService', () => {
  let service: DeleteSalesChannelService;
  let salesChannelRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockSalesChannel = createMockSalesChannel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSalesChannelService,
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteSalesChannelService>(DeleteSalesChannelService);
    salesChannelRepository = module.get(getRepositoryToken(SalesChannelEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteSalesChannel', () => {
    it('should delete a sales channel successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );
      salesChannelRepository.remove.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );

      const result = await service.deleteSalesChannel(1);

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
      expect(salesChannelRepository.remove).toHaveBeenCalledWith(
        mockSalesChannel
      );
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteSalesChannel(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(salesChannelRepository.findOne).not.toHaveBeenCalled();
      expect(salesChannelRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when sales channel does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteSalesChannel(999)).rejects.toThrow(
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
      expect(salesChannelRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when sales channel belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteSalesChannel(1)).rejects.toThrow(
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
      expect(salesChannelRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle different sales channel IDs correctly', async () => {
      const salesChannelId = 999;
      const differentChannel = createMockSalesChannel({ id: salesChannelId });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        differentChannel as SalesChannelEntity
      );
      salesChannelRepository.remove.mockResolvedValue(
        differentChannel as SalesChannelEntity
      );

      const result = await service.deleteSalesChannel(salesChannelId);

      expect(salesChannelRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: salesChannelId,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result.id).toBe(salesChannelId);
    });

    it('should handle database errors during sales channel lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteSalesChannel(1)).rejects.toThrow(
        'Database error'
      );

      expect(salesChannelRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );
      salesChannelRepository.remove.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteSalesChannel(1)).rejects.toThrow(
        'Database error'
      );

      expect(salesChannelRepository.remove).toHaveBeenCalledWith(
        mockSalesChannel
      );
    });

    it('should preserve sales channel properties in return value', async () => {
      const detailedSalesChannel = createMockSalesChannel({
        id: 5,
        name: 'Detailed Channel',
        description: 'Detailed description',
        logoUrl: 'https://example.com/logo.png',
        isActive: false,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        detailedSalesChannel as SalesChannelEntity
      );
      salesChannelRepository.remove.mockResolvedValue(
        detailedSalesChannel as SalesChannelEntity
      );

      const result = await service.deleteSalesChannel(5);

      expect(result).toEqual({
        id: 5,
        name: 'Detailed Channel',
        description: 'Detailed description',
        logoUrl: 'https://example.com/logo.png',
        organizationId: 1,
        isActive: false,
        organization: mockOrganization,
      });
    });

    it('should work with inactive sales channels', async () => {
      const inactiveSalesChannel = createMockSalesChannel({
        isActive: false,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        inactiveSalesChannel as SalesChannelEntity
      );
      salesChannelRepository.remove.mockResolvedValue(
        inactiveSalesChannel as SalesChannelEntity
      );

      const result = await service.deleteSalesChannel(1);

      expect(result.isActive).toBe(false);
      expect(salesChannelRepository.remove).toHaveBeenCalledWith(
        inactiveSalesChannel
      );
    });

    it('should work with sales channels that have no description', async () => {
      const channelWithoutDescription = createMockSalesChannel({
        description: null,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelRepository.findOne.mockResolvedValue(
        channelWithoutDescription as SalesChannelEntity
      );
      salesChannelRepository.remove.mockResolvedValue(
        channelWithoutDescription as SalesChannelEntity
      );

      const result = await service.deleteSalesChannel(1);

      expect(result.description).toBe(null);
      expect(salesChannelRepository.remove).toHaveBeenCalledWith(
        channelWithoutDescription
      );
    });
  });
});
