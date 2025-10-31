// apps/api/src/resources/cms/media/services/get-media-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetMediaByIdService } from './service';
import { MediaEntity } from '@/database/entities/media.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockMedia,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('GetMediaByIdService', () => {
  let service: GetMediaByIdService;
  let mediaRepository: jest.Mocked<Repository<MediaEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockMedia = createMockMedia();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMediaByIdService,
        {
          provide: getRepositoryToken(MediaEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetMediaByIdService>(GetMediaByIdService);
    mediaRepository = module.get(getRepositoryToken(MediaEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMediaById', () => {
    it('should return media when it exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);

      const result = await service.getMediaById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result).toEqual(mockMedia);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getMediaById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(mediaRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when media does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.getMediaById(999)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 999 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should throw NotFoundException when media belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.getMediaById(1)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 1 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle different media IDs correctly', async () => {
      const mediaId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);

      await service.getMediaById(mediaId);

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mediaId,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle database errors during lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.getMediaById(1)).rejects.toThrow('Database error');

      expect(mediaRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return media with complete relations', async () => {
      const mediaWithRelations = {
        ...mockMedia,
        organization: mockOrganization,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(
        mediaWithRelations as MediaEntity
      );

      const result = await service.getMediaById(1);

      expect(result).toEqual(mediaWithRelations);
      expect(result.organization).toEqual(mockOrganization);
    });

    it('should handle media with different properties', async () => {
      const differentMedia = createMockMedia({
        id: 2,
        url: 'https://blob.vercel-storage.com/photo.jpg',
        description: 'Vacation photo',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(differentMedia as MediaEntity);

      const result = await service.getMediaById(2);

      expect(result).toEqual(differentMedia);
      expect(result.url).toBe('https://blob.vercel-storage.com/photo.jpg');
      expect(result.description).toBe('Vacation photo');
    });

    it('should handle media with null description', async () => {
      const mediaWithoutDescription = createMockMedia({
        description: null,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(
        mediaWithoutDescription as MediaEntity
      );

      const result = await service.getMediaById(1);

      expect(result.description).toBe(null);
    });
  });
});
