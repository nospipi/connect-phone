// apps/api/src/resources/sales-channels/services/create-random-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateRandomChannelService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { OrganizationContextService } from '../../../../common/core/organization-context.service';
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
  let organizationContextService: jest.Mocked<OrganizationContextService>;

  const mockOrganization: Organization = {
    id: 31,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    users: [],
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
    };

    const mockOrganizationsRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const mockOrganizationContextService = {
      getRequiredOrganization: jest.fn(),
      getCurrentOrganization: jest.fn(),
      getCurrentUser: jest.fn(),
      getRequiredUser: jest.fn(),
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
          provide: OrganizationContextService,
          useValue: mockOrganizationContextService,
        },
      ],
    }).compile();

    service = module.get<CreateRandomChannelService>(
      CreateRandomChannelService
    );
    salesChannelsRepository = module.get(getRepositoryToken(SalesChannel));
    organizationsRepository = module.get(getRepositoryToken(Organization));
    organizationContextService = module.get(OrganizationContextService);
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
      organizationContextService.getRequiredOrganization.mockResolvedValue(
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
        organizationContextService.getRequiredOrganization
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

    it('should throw error when user has no organization', async () => {
      // Arrange
      organizationContextService.getRequiredOrganization.mockRejectedValue(
        new NotFoundException('Organization not found')
      );

      // Act & Assert
      await expect(
        service.createSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow(new NotFoundException('Organization not found'));
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
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

      organizationContextService.getRequiredOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createRandomSalesChannel();

      // Assert
      expect(
        organizationContextService.getRequiredOrganization
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
      organizationContextService.getRequiredOrganization.mockRejectedValue(
        new NotFoundException('Organization not found')
      );

      // Act & Assert
      await expect(service.createRandomSalesChannel()).rejects.toThrow(
        new NotFoundException('Organization not found')
      );
      expect(
        organizationContextService.getRequiredOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
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
