// apps/api/src/resources/media/services/get-by-ids/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { validate } from 'class-validator';
import { GetMediaByIdsService } from './service';
import { GetMediaByIdsQueryDto } from './dto';
import { MediaEntity } from '@/database/entities/media.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockMedia,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//------------------------------------------------------------

describe('GetMediaByIdsService', () => {
  let service: GetMediaByIdsService;
  let mediaRepository: jest.Mocked<Repository<MediaEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockMediaItems = [
    createMockMedia({ id: 1, description: 'First image' }),
    createMockMedia({ id: 2, description: 'Second image' }),
    createMockMedia({ id: 3, description: 'Third image' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMediaByIdsService,
        {
          provide: getRepositoryToken(MediaEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetMediaByIdsService>(GetMediaByIdsService);
    mediaRepository = module.get(getRepositoryToken(MediaEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMediaByIds', () => {
    it('should return media matching provided IDs', async () => {
      const ids = [1, 2, 3];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue(mockMediaItems as MediaEntity[]);

      const result = await service.getMediaByIds(ids);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual(mockMediaItems);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no IDs are provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue([]);

      const result = await service.getMediaByIds([]);

      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In([]),
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual([]);
    });

    it('should return empty array when no media match provided IDs', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue([]);

      const result = await service.getMediaByIds([999, 998, 997]);

      expect(mediaRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return only media that exist and belong to organization', async () => {
      const ids = [1, 2, 999];
      const partialResults = [mockMediaItems[0], mockMediaItems[1]];

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue(partialResults as MediaEntity[]);

      const result = await service.getMediaByIds(ids);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return media ordered by createdAt DESC', async () => {
      const ids = [3, 1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue(mockMediaItems as MediaEntity[]);

      const result = await service.getMediaByIds(ids);

      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual(mockMediaItems);
    });

    it('should handle single ID in array', async () => {
      const ids = [1];
      const singleMedia = [mockMediaItems[0]];

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue(singleMedia as MediaEntity[]);

      const result = await service.getMediaByIds(ids);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should handle duplicate IDs by returning unique media', async () => {
      const ids = [1, 1, 2, 2];
      const uniqueMedia = [mockMediaItems[0], mockMediaItems[1]];

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue(uniqueMedia as MediaEntity[]);

      const result = await service.getMediaByIds(ids);

      expect(result).toHaveLength(2);
    });

    it('should filter media by current organization', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue([]);

      await service.getMediaByIds(ids);

      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    });

    it('should handle different organization IDs correctly', async () => {
      const ids = [1, 2];
      const differentOrg = createMockOrganization({ id: 5 });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      mediaRepository.find.mockResolvedValue([]);

      await service.getMediaByIds(ids);

      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 5,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    });

    it('should handle null organization', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      mediaRepository.find.mockResolvedValue([]);

      await service.getMediaByIds(ids);

      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: undefined,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    });

    it('should handle database errors', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getMediaByIds(ids)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle large arrays of IDs', async () => {
      const largeIdArray = Array.from({ length: 100 }, (_, i) => i + 1);
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.find.mockResolvedValue([]);

      await service.getMediaByIds(largeIdArray);

      expect(mediaRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(largeIdArray),
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    });
  });

  describe('GetMediaByIdsQueryDto validation', () => {
    it('should validate successfully with valid comma-separated IDs', async () => {
      const dto = new GetMediaByIdsQueryDto();
      dto.ids = '1,2,3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with single ID', async () => {
      const dto = new GetMediaByIdsQueryDto();
      dto.ids = '1';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with IDs containing spaces', async () => {
      const dto = new GetMediaByIdsQueryDto();
      dto.ids = '1, 2, 3';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when ids is empty', async () => {
      const dto = new GetMediaByIdsQueryDto();
      dto.ids = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });

    it('should fail validation when ids is not a string', async () => {
      const dto = new GetMediaByIdsQueryDto();
      (dto as any).ids = 123;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('ids');
    });
  });
});
