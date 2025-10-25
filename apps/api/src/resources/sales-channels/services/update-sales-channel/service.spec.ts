// apps/api/src/resources/sales-channels/services/update-sales-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateSalesChannelService } from './service';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { UpdateSalesChannelDto } from './update-sales-channel.dto';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockSalesChannel,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('UpdateSalesChannelService', () => {
  let service: UpdateSalesChannelService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockSalesChannel = createMockSalesChannel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSalesChannelService,
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateSalesChannelService>(UpdateSalesChannelService);
    salesChannelsRepository = module.get(
      getRepositoryToken(SalesChannelEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSalesChannel', () => {
    it('should update a sales channel successfully', async () => {
      const updateDto: UpdateSalesChannelDto = {
        id: 1,
        name: 'Updated Channel Name',
        description: 'Updated description',
        isActive: false,
      };

      const updatedChannel = {
        ...mockSalesChannel,
        name: 'Updated Channel Name',
        description: 'Updated description',
        isActive: false,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );
      salesChannelsRepository.save.mockResolvedValue(
        updatedChannel as SalesChannelEntity
      );

      const result = await service.updateSalesChannel(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
        relations: ['organization'],
      });
      expect(salesChannelsRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Channel Name');
      expect(result.description).toBe('Updated description');
      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateSalesChannelDto = {
        name: 'Updated Channel Name',
      };

      await expect(service.updateSalesChannel(updateDto)).rejects.toThrow(
        new NotFoundException('Sales channel ID is required')
      );

      expect(salesChannelsRepository.findOne).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateSalesChannelDto = {
        id: 1,
        name: 'Updated Channel Name',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateSalesChannel(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(salesChannelsRepository.findOne).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when sales channel does not exist', async () => {
      const updateDto: UpdateSalesChannelDto = {
        id: 999,
        name: 'Updated Channel Name',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(null);

      await expect(service.updateSalesChannel(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Sales channel with ID 999 not found in current organization'
        )
      );

      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when sales channel belongs to different organization', async () => {
      const updateDto: UpdateSalesChannelDto = {
        id: 1,
        name: 'Updated Channel Name',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(null);

      await expect(service.updateSalesChannel(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Sales channel with ID 1 not found in current organization'
        )
      );

      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
        relations: ['organization'],
      });
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const updateDto: UpdateSalesChannelDto = {
        id: 1,
        name: 'Updated Channel Name',
      };

      const originalChannel = {
        ...mockSalesChannel,
        description: 'Original Description',
        isActive: true,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(
        originalChannel as SalesChannelEntity
      );
      salesChannelsRepository.save.mockImplementation(
        async (entity) => entity as SalesChannelEntity
      );

      await service.updateSalesChannel(updateDto);

      const savedChannel = salesChannelsRepository.save.mock.calls[0][0];
      expect(savedChannel.name).toBe('Updated Channel Name');
      expect(savedChannel.description).toBe('Original Description');
      expect(savedChannel.isActive).toBe(true);
    });

    it('should handle logoId updates', async () => {
      const updateDto = {
        id: 1,
        logoId: 5,
      } as unknown as UpdateSalesChannelDto;

      const updatedChannel = {
        ...mockSalesChannel,
        logoId: 5,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );
      salesChannelsRepository.save.mockResolvedValue(
        updatedChannel as SalesChannelEntity
      );

      const result = await service.updateSalesChannel(updateDto);

      expect(result.logoId).toBe(5);
    });

    it('should handle isActive toggle', async () => {
      const updateDto = {
        id: 1,
        isActive: false,
      } as unknown as UpdateSalesChannelDto;

      const updatedChannel = {
        ...mockSalesChannel,
        isActive: false,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );
      salesChannelsRepository.save.mockResolvedValue(
        updatedChannel as SalesChannelEntity
      );

      const result = await service.updateSalesChannel(updateDto);

      expect(result.isActive).toBe(false);
    });

    it('should clear description when empty string is provided', async () => {
      const updateDto: UpdateSalesChannelDto = {
        id: 1,
        description: '',
      };

      const originalChannel = {
        ...mockSalesChannel,
        description: 'Original Description',
      };

      const clearedChannel = {
        ...originalChannel,
        description: null,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(
        originalChannel as SalesChannelEntity
      );
      salesChannelsRepository.save.mockResolvedValue(
        clearedChannel as SalesChannelEntity
      );

      const result = await service.updateSalesChannel(updateDto);

      const savedChannel = salesChannelsRepository.save.mock.calls[0][0];
      expect(savedChannel.description).toBe(null);
      expect(result.description).toBe(null);
    });

    it('should handle database errors during save', async () => {
      const updateDto = {
        id: 1,
        name: 'Updated Channel Name',
      } as unknown as UpdateSalesChannelDto;

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(
        mockSalesChannel as SalesChannelEntity
      );
      salesChannelsRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.updateSalesChannel(updateDto)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
