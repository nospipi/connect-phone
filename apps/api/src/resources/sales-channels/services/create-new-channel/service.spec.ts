// apps/api/src/resources/sales-channels/services/create-new-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateNewChannelService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from '../../dto/create-sales-channel.dto';
import * as crypto from 'crypto';

//--------------------------------------------

// ✅ Keep crypto mock
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('CreateNewChannelService', () => {
  let service: CreateNewChannelService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannel>>;
  let organizationsRepository: jest.Mocked<Repository<Organization>>;

  const mockOrganization: Organization = {
    id: 31,
    uuid: 'org-uuid-31',
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
  };

  const mockSalesChannel: SalesChannel = {
    id: 1,
    uuid: 'sc-uuid-123',
    name: 'Test Sales Channel',
    description: 'Test Description',
    organizationId: 31,
    logoUrl: null,
    organization: mockOrganization,
  };

  const mockCreateSalesChannelDto: CreateSalesChannelDto = {
    name: 'Test Sales Channel',
    description: 'Test Description',
    organizationId: 89,
  };

  beforeEach(async () => {
    const mockSalesChannelsRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockOrganizationsRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNewChannelService,
        {
          provide: getRepositoryToken(SalesChannel),
          useValue: mockSalesChannelsRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrganizationsRepository,
        },
      ],
    }).compile();

    service = module.get<CreateNewChannelService>(CreateNewChannelService);
    salesChannelsRepository = module.get(getRepositoryToken(SalesChannel));
    organizationsRepository = module.get(getRepositoryToken(Organization));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewSalesChannel', () => {
    it('should create a new sales channel successfully', async () => {
      // Arrange
      const mockUuid = 'random-uuid-123';
      (crypto.randomUUID as jest.Mock).mockReturnValue(mockUuid);

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createNewSalesChannel(
        mockCreateSalesChannelDto
      );

      // Assert
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCreateSalesChannelDto.organizationId },
      });
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        uuid: mockUuid,
        name: mockCreateSalesChannelDto.name,
        description: mockCreateSalesChannelDto.description,
        organizationId: 31,
      });
      expect(salesChannelsRepository.save).toHaveBeenCalledWith(
        mockSalesChannel
      );
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw NotFoundException when organization is not found', async () => {
      // Arrange
      organizationsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.createNewSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow(new NotFoundException('Organization not found'));
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCreateSalesChannelDto.organizationId },
      });
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should handle optional description correctly', async () => {
      // Arrange
      const dtoWithoutDescription = {
        name: 'Test Channel',
        organizationId: 89,
      };
      const mockUuid = 'random-uuid-456';
      (crypto.randomUUID as jest.Mock).mockReturnValue(mockUuid);

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createNewSalesChannel(dtoWithoutDescription);

      // Assert
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        uuid: mockUuid,
        name: dtoWithoutDescription.name,
        description: undefined,
        organizationId: 31,
      });
      expect(result).toEqual(mockSalesChannel);
    });
  });
});
