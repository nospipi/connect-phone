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
    userOrganizations: [] as any[],
  } as unknown as Organization;

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
  } as unknown as User;

  const mockSalesChannel: SalesChannel = {
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    organizationId: 31,
    logoUrl: null,
    organization: mockOrganization,
  } as unknown as SalesChannel;

  const mockCreateSalesChannelDto: CreateSalesChannelDto = {
    name: 'Test Sales Channel',
    description: 'Test Description',
  };

  beforeEach(async () => {
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
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            findOne: jest.fn(),
          },
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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      const result = await service.createNewSalesChannel(
        mockCreateSalesChannelDto
      );

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
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);

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
      const dtoWithoutDescription = { name: 'Test Channel' };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      const result = await service.createNewSalesChannel(dtoWithoutDescription);

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
      const mockChannels = [mockSalesChannel];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.find.mockResolvedValue(mockChannels);

      const result = await service.getAllForCurrentOrganization();

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
      const channelId = 1;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);

      const result = await service.findOneForCurrentOrganization(channelId);

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
      const channelId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOneForCurrentOrganization(channelId)
      ).rejects.toThrow(new NotFoundException('Sales channel not found'));
    });
  });

  describe('updateForCurrentOrganization', () => {
    it('should update a sales channel for current organization', async () => {
      const channelId = 1;
      const updateDto = { name: 'Updated Name' };
      const updatedChannel = { ...mockSalesChannel, name: 'Updated Name' };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(updatedChannel);

      const result = await service.updateForCurrentOrganization(
        channelId,
        updateDto
      );

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
      const channelId = 1;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);
      salesChannelsRepository.remove.mockResolvedValue(mockSalesChannel);

      await service.removeForCurrentOrganization(channelId);

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
});
