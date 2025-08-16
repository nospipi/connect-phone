// apps/api/src/resources/sales-channels/services/create-random-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRandomChannelService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '../../../../database/entities/user.entity';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { faker } from '@faker-js/faker';

//--------------------------------------------

// ✅ Partial mock for faker to preserve locale data
jest.mock('@faker-js/faker', () => {
  const actual = jest.requireActual('@faker-js/faker');
  return {
    ...actual,
    faker: {
      ...actual.faker,
      company: {
        ...actual.faker.company,
        name: jest.fn(),
        catchPhrase: jest.fn(),
      },
    },
  };
});

describe('CreateRandomChannelService', () => {
  let service: CreateRandomChannelService;
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
    fullName: 'Test User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 31,
    loggedOrganization: mockOrganization,
    organizations: [mockOrganization],
  };

  const mockSalesChannel: SalesChannel = {
    id: 1,
    name: 'Test Company',
    description: 'Test Catchphrase',
    logoUrl: null,
    organizationId: 31,
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
    };

    const mockOrganizationsRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const mockCurrentOrganizationService = {
      getCurrentOrganization: jest.fn(),
    };

    const mockCurrentDbUserService = {
      getCurrentDbUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRandomChannelService,
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

    service = module.get<CreateRandomChannelService>(
      CreateRandomChannelService
    );
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

  describe('createSalesChannel', () => {
    it('should create a sales channel for current organization successfully', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createSalesChannel(
        mockCreateSalesChannelDto
      );

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        name: mockCreateSalesChannelDto.name,
        description: mockCreateSalesChannelDto.description,
        logoUrl: undefined,
        organizationId: 31,
      });
      expect(salesChannelsRepository.save).toHaveBeenCalledWith(
        mockSalesChannel
      );
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw UnauthorizedException when user not found in database', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.createSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow(
        new UnauthorizedException('User not found in database')
      );
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not logged into any organization', async () => {
      // Arrange
      const userWithoutOrg = { ...mockUser, loggedOrganizationId: null };
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(userWithoutOrg);

      // Act & Assert
      await expect(
        service.createSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow(
        new UnauthorizedException('User is not logged into any organization')
      );
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when organization not found', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        service.createSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow(new NotFoundException('Organization not found'));
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('createRandomSalesChannel', () => {
    it('should create a random sales channel for current organization successfully', async () => {
      const mockName = 'Random Company';
      const mockDescription = 'Random Catchphrase';

      (faker.company.name as jest.Mock).mockReturnValue(mockName);
      (faker.company.catchPhrase as jest.Mock).mockReturnValue(mockDescription);

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createRandomSalesChannel();

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        name: mockName,
        description: mockDescription,
        logoUrl: undefined,
        organizationId: 31,
      });
      expect(salesChannelsRepository.save).toHaveBeenCalledWith(
        mockSalesChannel
      );
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw error when user has no organization', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createRandomSalesChannel()).rejects.toThrow(
        new UnauthorizedException('User not found in database')
      );
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
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
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: channelId, organizationId: 31 },
        relations: ['organization'],
      });
    });
  });

  describe('createRandomSalesChannelForAnyOrganization', () => {
    it('should create a random sales channel for any random organization successfully', async () => {
      const mockName = 'Random Company';
      const mockDescription = 'Random Catchphrase';

      (faker.company.name as jest.Mock).mockReturnValue(mockName);
      (faker.company.catchPhrase as jest.Mock).mockReturnValue(mockDescription);

      organizationsRepository.find.mockResolvedValue([mockOrganization]);
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createRandomSalesChannelForAnyOrganization();

      // Assert
      expect(organizationsRepository.find).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        name: mockName,
        description: mockDescription,
        logoUrl: undefined,
        organizationId: 31,
      });
      expect(salesChannelsRepository.save).toHaveBeenCalledWith(
        mockSalesChannel
      );
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw NotFoundException when no organizations exist', async () => {
      // Arrange
      organizationsRepository.find.mockResolvedValue([]);

      // Act & Assert
      await expect(
        service.createRandomSalesChannelForAnyOrganization()
      ).rejects.toThrow(new NotFoundException('No organizations found'));
      expect(organizationsRepository.find).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });
  });
});
