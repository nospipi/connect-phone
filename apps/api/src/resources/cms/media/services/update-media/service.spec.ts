// apps/api/src/resources/cms/media/services/update-media/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateMediaService } from './service';
import { MediaEntity } from '@/database/entities/media.entity';
import { UpdateMediaDto } from './update-media.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockMedia,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('UpdateMediaService', () => {
  let service: UpdateMediaService;
  let mediaRepository: jest.Mocked<Repository<MediaEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockMedia = createMockMedia();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMediaService,
        {
          provide: getRepositoryToken(MediaEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateMediaService>(UpdateMediaService);
    mediaRepository = module.get(getRepositoryToken(MediaEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateMedia', () => {
    it('should update media description successfully', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: 'Updated description',
      };

      const updatedMedia = createMockMedia({
        description: 'Updated description',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);
      mediaRepository.save.mockResolvedValue(updatedMedia as MediaEntity);

      const result = await service.updateMedia(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(mediaRepository.save).toHaveBeenCalled();
      expect(result.description).toBe('Updated description');
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateMediaDto = {
        description: 'Updated description',
      };

      await expect(service.updateMedia(updateDto)).rejects.toThrow(
        new NotFoundException('Media ID is required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).not.toHaveBeenCalled();
      expect(mediaRepository.findOne).not.toHaveBeenCalled();
      expect(mediaRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: 'Updated description',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateMedia(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(mediaRepository.findOne).not.toHaveBeenCalled();
      expect(mediaRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when media does not exist', async () => {
      const updateDto: UpdateMediaDto = {
        id: 999,
        description: 'Updated description',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.updateMedia(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 999 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, organizationId: 1 },
      });
      expect(mediaRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when media belongs to different organization', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: 'Updated description',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.updateMedia(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 1 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(mediaRepository.save).not.toHaveBeenCalled();
    });

    it('should update only description field when provided', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: 'New description',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);
      mediaRepository.save.mockImplementation(
        async (entity) => entity as MediaEntity
      );

      await service.updateMedia(updateDto);

      const savedMedia = mediaRepository.save.mock.calls[0][0];
      expect(savedMedia.description).toBe('New description');
      expect(savedMedia.url).toBe('https://blob.vercel-storage.com/test.jpg');
    });

    it('should set description to null when empty string provided', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: null,
      };

      const updatedMedia = createMockMedia({
        description: null,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);
      mediaRepository.save.mockResolvedValue(updatedMedia as MediaEntity);

      const result = await service.updateMedia(updateDto);

      expect(result.description).toBe(null);
    });

    it('should handle database errors during save', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: 'Updated description',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mediaRepository.findOne.mockResolvedValue(mockMedia as MediaEntity);
      mediaRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.updateMedia(updateDto)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle different organization IDs correctly', async () => {
      const updateDto: UpdateMediaDto = {
        id: 1,
        description: 'Updated description',
      };

      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      mediaRepository.findOne.mockResolvedValue(null);

      await expect(service.updateMedia(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Media with ID 1 not found in current organization'
        )
      );

      expect(mediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 5 },
      });
    });
  });
});
