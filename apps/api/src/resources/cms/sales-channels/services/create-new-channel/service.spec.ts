// apps/api/src/resources/cms/sales-channels/services/create-new-channel/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewChannelService } from './service';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockSalesChannel,
  createMockQueryBuilder,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('CreateNewChannelService', () => {
  let service: CreateNewChannelService;
  let salesChannelsRepository: jest.Mocked<Repository<SalesChannelEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockSalesChannel = createMockSalesChannel({ organizationId: 31 });
  const mockCreateSalesChannelDto: CreateSalesChannelDto = {
    name: 'Test Sales Channel',
    description: 'Test Description',
  };
  const mockQueryBuilder = createMockQueryBuilder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNewChannelService,
        {
          provide: getRepositoryToken(SalesChannelEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateNewChannelService>(CreateNewChannelService);
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

  describe('createNewSalesChannel', () => {
    it('should create a new sales channel successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      mockQueryBuilder.execute.mockResolvedValue({
        raw: [mockSalesChannel],
      });

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
      expect(salesChannelsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(SalesChannelEntity);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith(mockSalesChannel);
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
      expect(result).toEqual(mockSalesChannel);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      mockQueryBuilder.execute.mockResolvedValue({
        raw: [mockSalesChannel],
      });

      const result = await service.createNewSalesChannel(
        mockCreateSalesChannelDto
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        name: mockCreateSalesChannelDto.name,
        description: mockCreateSalesChannelDto.description,
        organizationId: undefined,
      });
      expect(result).toEqual(mockSalesChannel);
    });

    it('should handle optional description correctly', async () => {
      const dtoWithoutDescription = { name: 'Test Channel' };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      mockQueryBuilder.execute.mockResolvedValue({
        raw: [mockSalesChannel],
      });

      const result = await service.createNewSalesChannel(dtoWithoutDescription);

      expect(salesChannelsRepository.create).toHaveBeenCalledWith({
        name: dtoWithoutDescription.name,
        description: undefined,
        organizationId: 31,
      });
      expect(result).toEqual(mockSalesChannel);
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      salesChannelsRepository.create.mockReturnValue(mockSalesChannel);
      mockQueryBuilder.execute.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createNewSalesChannel(mockCreateSalesChannelDto)
      ).rejects.toThrow('Database error');
    });
  });
});
