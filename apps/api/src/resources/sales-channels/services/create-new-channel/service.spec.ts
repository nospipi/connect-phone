// apps/api/src/resources/sales-channels/services/create-new-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateNewChannelService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '../../../../database/entities/user.entity';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

//--------------------------------------------

describe('CreateNewChannelService', () => {
  let service: CreateNewChannelService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannel>>;
  let organizationsRepository: jest.Mocked<Repository<Organization>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization: Organization = {
    id: 31,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    users: [],
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 31,
    loggedOrganization: mockOrganization,
    organizations: [mockOrganization],
  };

  const mockSalesChannel: SalesChannel = {
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    organizationId: 31,
    logoUrl: null,
    organization: mockOrganization,
  };

  const mockCreateSalesChannelDto: CreateSalesChannelDto = {
    name: 'Test Sales Channel',
    description: 'Test Description',
  };

  beforeEach(async () => {
    const mockSalesChannelsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      remove: jest.fn(),
    };

    const mockOrganizationsRepository = {
      findOne: jest.fn(),
    };

    const mockCurrentOrganizationService = {
      getCurrentOrganization: jest.fn(),
    };

    const mockCurrentDbUserService = {
      getCurrentDbUser: jest.fn(),
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
        {
          provide: CurrentOrganizationService,
          useValue: mockCurrentOrganizationService,
        },
        {
          provide: CurrentDbUserService,
          useValue: mockCurrentDbUserService,
        },
      ],
    }).compile();

    service = module.get<CreateNewChannelService>(CreateNewChannelService);
    salesChannelsRepository = module.get(getRepositoryToken(SalesChannel));
    organizationsRepository = module.get(getRepositoryToken(Organization));
    currentOrganizationService = module.get(CurrentOrganizationService);
    currentDbUserService = module.get(CurrentDbUserService);
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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createNewSalesChannel(
        mockCreateSalesChannelDto
      );

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        service.createNewSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow(new NotFoundException('Organization not found'));
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should handle optional description correctly', async () => {
      // Arrange
      const dtoWithoutDescription = {
        name: 'Test Channel',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createNewSalesChannel(dtoWithoutDescription);

      // Assert
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        name: dtoWithoutDescription.name,
        description: undefined,
        organizationId: 31,
      });
      expect(result).toEqual(mockSalesChannel);
    });
  });

  describe('getAllForCurrentOrganization', () => {
    it('should get all sales channels for current organization', async () => {
      // Arrange
      const mockChannels = [mockSalesChannel];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.find.mockResolvedValue(mockChannels);

      // Act
      const result = await service.getAllForCurrentOrganization();

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.find).toHaveBeenCalledWith({
        where: { organizationId: 31 },
        relations: ['organization'],
        order: { id: 'DESC' },
      });
      expect(result).toEqual(mockChannels);
    });
  });

  describe('findOneForCurrentOrganization', () => {
    it('should find a specific sales channel for current organization', async () => {
      // Arrange
      const channelId = 1;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.findOneForCurrentOrganization(channelId);

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: channelId, organizationId: 31 },
        relations: ['organization'],
      });
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw NotFoundException when sales channel not found', async () => {
      // Arrange
      const channelId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findOneForCurrentOrganization(channelId)
      ).rejects.toThrow(new NotFoundException('Sales channel not found'));
    });
  });

  describe('updateForCurrentOrganization', () => {
    it('should update a sales channel for current organization', async () => {
      // Arrange
      const channelId = 1;
      const updateDto = { name: 'Updated Name' };
      const updatedChannel = { ...mockSalesChannel, name: 'Updated Name' };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(updatedChannel);

      // Act
      const result = await service.updateForCurrentOrganization(
        channelId,
        updateDto
      );

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: channelId, organizationId: 31 },
        relations: ['organization'],
      });
      expect(salesChannelsRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedChannel);
    });
  });

  describe('removeForCurrentOrganization', () => {
    it('should remove a sales channel for current organization', async () => {
      // Arrange
      const channelId = 1;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);
      salesChannelsRepository.remove.mockResolvedValue(mockSalesChannel);

      // Act
      await service.removeForCurrentOrganization(channelId);

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: channelId, organizationId: 31 },
        relations: ['organization'],
      });
      expect(salesChannelsRepository.remove).toHaveBeenCalledWith(
        mockSalesChannel
      );
    });
  });

  describe('getStatsForCurrentOrganization', () => {
    it('should get stats for current organization', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.count.mockResolvedValue(5);

      // Act
      const result = await service.getStatsForCurrentOrganization();

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.count).toHaveBeenCalledWith({
        where: { organizationId: 31 },
      });
      expect(result).toEqual({
        organizationName: 'Test Organization',
        totalChannels: 5,
        organizationId: 31,
      });
    });
  });

  describe('getCurrentUserInfo', () => {
    it('should get current user and organization info', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );

      // Act
      const result = await service.getCurrentUserInfo();

      // Assert
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        user: { id: 1, email: 'test@example.com', fullName: 'Test User' },
        organization: { id: 31, name: 'Test Organization' },
      });
    });

    it('should handle null user and organization', async () => {
      // Arrange
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      // Act
      const result = await service.getCurrentUserInfo();

      // Assert
      expect(result).toEqual({
        user: null,
        organization: null,
      });
    });
  });
});
