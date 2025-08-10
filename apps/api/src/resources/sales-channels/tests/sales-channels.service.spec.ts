import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SalesChannelsService } from './sales-channels.service';
import { SalesChannel } from '../../database/entities/sales-channel.entity';
import { Organization } from '../../database/entities/organization.entity';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

// Mock the external dependencies
jest.mock('nestjs-typeorm-paginate');
jest.mock('@faker-js/faker');
jest.mock('crypto');

describe('SalesChannelsService', () => {
  let service: SalesChannelsService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannel>>;
  let organizationsRepository: jest.Mocked<Repository<Organization>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<SalesChannel>>;

  const mockOrganization: Organization = {
    id: 1,
    uuid: 'org-uuid-123',
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
    organizationId: 1,
    organization: mockOrganization,
  };

  const mockCreateSalesChannelDto: CreateSalesChannelDto = {
    name: 'New Sales Channel',
    description: 'New Description',
    organizationUuid: 'org-uuid-123',
  };

  beforeEach(async () => {
    // Create mocked query builder
    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    } as any;

    // Create mocked repositories
    const mockSalesChannelsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    const mockOrganizationsRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesChannelsService,
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

    service = module.get<SalesChannelsService>(SalesChannelsService);
    salesChannelsRepository = module.get(getRepositoryToken(SalesChannel));
    organizationsRepository = module.get(getRepositoryToken(Organization));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sales channel successfully', async () => {
      // Arrange
      const mockUuid = 'generated-uuid-123';
      (crypto.randomUUID as jest.Mock).mockReturnValue(mockUuid);

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.create(mockCreateSalesChannelDto);

      // Assert
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: mockCreateSalesChannelDto.organizationUuid },
      });
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        uuid: mockUuid,
        name: mockCreateSalesChannelDto.name,
        description: mockCreateSalesChannelDto.description,
        organizationId: mockOrganization.id,
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
      await expect(service.create(mockCreateSalesChannelDto)).rejects.toThrow(
        new NotFoundException('Organization not found')
      );
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: mockCreateSalesChannelDto.organizationUuid },
      });
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAllByOrganizationPaginated', () => {
    const mockPaginationResult = {
      items: [mockSalesChannel],
      meta: {
        itemCount: 1,
        totalItems: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
      links: {},
    };

    it('should return paginated sales channels successfully', async () => {
      // Arrange
      const organizationId = 1;
      const page = 1;
      const limit = 10;

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAllByOrganizationPaginated(
        organizationId,
        page,
        limit
      );

      // Assert
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(salesChannelsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'salesChannel'
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'salesChannel.organization',
        'organization'
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'salesChannel.organizationId = :organizationId',
        { organizationId }
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'salesChannel.id',
        'DESC'
      );
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page,
        limit,
        route: `/sales-channels/organization/${organizationId}/paginated`,
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default values for page and limit', async () => {
      // Arrange
      const organizationId = 1;

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(organizationId);

      // Assert
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page: 1,
        limit: 10,
        route: `/sales-channels/organization/${organizationId}/paginated`,
      });
    });

    it('should validate limit bounds (minimum)', async () => {
      // Arrange
      const organizationId = 1;
      const page = 1;
      const limit = -5; // Invalid limit

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(organizationId, page, limit);

      // Assert
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page,
        limit: 1, // Should be corrected to minimum value
        route: `/sales-channels/organization/${organizationId}/paginated`,
      });
    });

    it('should validate limit bounds (maximum)', async () => {
      // Arrange
      const organizationId = 1;
      const page = 1;
      const limit = 150; // Invalid limit (too high)

      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(organizationId, page, limit);

      // Assert
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page,
        limit: 100, // Should be corrected to maximum value
        route: `/sales-channels/organization/${organizationId}/paginated`,
      });
    });

    it('should throw NotFoundException when organization is not found', async () => {
      // Arrange
      const organizationId = 999;
      organizationsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findAllByOrganizationPaginated(organizationId)
      ).rejects.toThrow(new NotFoundException('Organization not found'));
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(salesChannelsRepository.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('createRandomSalesChannel', () => {
    it('should create a random sales channel successfully', async () => {
      // Arrange
      const mockUuid = 'random-uuid-123';
      const mockName = 'Random Company';
      const mockDescription = 'Random Catchphrase';

      (crypto.randomUUID as jest.Mock).mockReturnValue(mockUuid);
      (faker.company.name as jest.Mock).mockReturnValue(mockName);
      (faker.company.catchPhrase as jest.Mock).mockReturnValue(mockDescription);

      const organizationWith31Id = { ...mockOrganization, id: 31 };
      organizationsRepository.findOne.mockResolvedValue(organizationWith31Id);
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      salesChannelsRepository.save.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.createRandomSalesChannel();

      // Assert
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 31 },
      });
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        uuid: mockUuid,
        name: mockName,
        description: mockDescription,
        organizationId: 31,
      });
      expect(salesChannelsRepository.save).toHaveBeenCalledWith(
        mockSalesChannel
      );
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw NotFoundException when organization with ID 31 is not found', async () => {
      // Arrange
      organizationsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createRandomSalesChannel()).rejects.toThrow(
        new NotFoundException('Organization not found')
      );
      expect(organizationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 31 },
      });
      expect(salesChannelsRepository.create).not.toHaveBeenCalled();
      expect(salesChannelsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a sales channel when found', async () => {
      // Arrange
      const id = 1;
      salesChannelsRepository.findOne.mockResolvedValue(mockSalesChannel);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['organization'],
      });
      expect(result).toEqual(mockSalesChannel);
    });

    it('should throw NotFoundException when sales channel is not found', async () => {
      // Arrange
      const id = 999;
      salesChannelsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException('Sales channel not found')
      );
      expect(salesChannelsRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['organization'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a sales channel successfully', async () => {
      // Arrange
      const id = 1;
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockSalesChannel);
      salesChannelsRepository.remove.mockResolvedValue(mockSalesChannel);

      // Act
      await service.remove(id);

      // Assert
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(salesChannelsRepository.remove).toHaveBeenCalledWith(
        mockSalesChannel
      );
    });

    it('should throw NotFoundException when sales channel to remove is not found', async () => {
      // Arrange
      const id = 999;
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Sales channel not found'));

      // Act & Assert
      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException('Sales channel not found')
      );
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(salesChannelsRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should propagate repository errors in create method', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      organizationsRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.create(mockCreateSalesChannelDto)).rejects.toThrow(
        dbError
      );
    });

    it('should propagate repository errors in findAllByOrganizationPaginated method', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      organizationsRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllByOrganizationPaginated(1)).rejects.toThrow(
        dbError
      );
    });

    it('should propagate pagination errors', async () => {
      // Arrange
      const paginationError = new Error('Pagination failed');
      organizationsRepository.findOne.mockResolvedValue(mockOrganization);
      (paginate as jest.Mock).mockRejectedValue(paginationError);

      // Act & Assert
      await expect(service.findAllByOrganizationPaginated(1)).rejects.toThrow(
        paginationError
      );
    });
  });
});
