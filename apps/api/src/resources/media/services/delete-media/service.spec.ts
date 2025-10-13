// apps/api/src/resources/media/services/delete-media/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteMediaService } from './service';
import { MediaEntity } from '../../../../database/entities/media.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockMedia,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//----------------------------------------------------------------------

describe('DeleteMediaService', () => {
  let service: DeleteMediaService;
  let mediaRepository: jest.Mocked<Repository<MediaEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockMedia = createMockMedia();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMediaService,
        {
          provide: getRepositoryToken(MediaEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<DeleteMediaService>(DeleteMediaService);
    mediaRepository = module.get(getRepositoryToken(MediaEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteMedia', () => {
    it('should delete media successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);
      mediaRepository.remove.mockResolvedValue(mockMedia as MediaEntity);

      const result = await service.deleteMedia(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
        relations: ['organization'],
      });
      expect(mediaRepository.remove).toHaveBeenCalledWith(mockMedia);
      expect(result).toEqual(mockMedia);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.deleteMedia(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(mediaRepository.findOne).not.toHaveBeenCalled();
      expect(mediaRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when media does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteMedia(999)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 999 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, organizationId: 1 },
        relations: ['organization'],
      });
      expect(mediaRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when media belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteMedia(1)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 1 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
        relations: ['organization'],
      });
      expect(mediaRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle different media IDs correctly', async () => {
      const mediaId = 999;
      const differentMedia = createMockMedia({ id: mediaId });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(differentMedia as MediaEntity);
      mediaRepository.remove.mockResolvedValue(differentMedia as MediaEntity);

      const result = await service.deleteMedia(mediaId);

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: mediaId, organizationId: 1 },
        relations: ['organization'],
      });
      expect(result.id).toBe(mediaId);
    });

    it('should handle database errors during lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteMedia(1)).rejects.toThrow('Database error');

      expect(mediaRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);
      mediaRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteMedia(1)).rejects.toThrow('Database error');

      expect(mediaRepository.remove).toHaveBeenCalledWith(mockMedia);
    });

    it('should preserve media properties in return value', async () => {
      const detailedMedia = createMockMedia({
        id: 5,
        url: 'https://blob.vercel-storage.com/detailed.jpg',
        description: 'Detailed description',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(detailedMedia as MediaEntity);
      mediaRepository.remove.mockResolvedValue(detailedMedia as MediaEntity);

      const result = await service.deleteMedia(5);

      expect(result).toEqual(detailedMedia);
      expect(result.url).toBe('https://blob.vercel-storage.com/detailed.jpg');
      expect(result.description).toBe('Detailed description');
    });

    it('should work with media that has null description', async () => {
      const mediaWithoutDescription = createMockMedia({
        description: null,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(
        mediaWithoutDescription as MediaEntity
      );
      mediaRepository.remove.mockResolvedValue(
        mediaWithoutDescription as MediaEntity
      );

      const result = await service.deleteMedia(1);

      expect(result.description).toBe(null);
      expect(mediaRepository.remove).toHaveBeenCalledWith(
        mediaWithoutDescription
      );
    });

    it('should handle different organization IDs correctly', async () => {
      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteMedia(1)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 1 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 5 },
        relations: ['organization'],
      });
    });
  });
});
