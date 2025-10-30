// apps/api/src/resources/media/services/create-media/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaService } from './service';
import { CreateMediaDto } from './create-media.dto';
import { MediaEntity } from '../../../../../database/entities/media.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import { IUploadedFile } from '@connect-phone/shared-types';
import * as vercelBlob from '@vercel/blob';
import {
  createMockOrganization,
  createMockMedia,
  createCurrentOrganizationServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

jest.mock('@vercel/blob');

describe('CreateMediaService', () => {
  let service: CreateMediaService;
  let mediaRepository: jest.Mocked<Repository<MediaEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization({ id: 31 });

  const mockFile: IUploadedFile = {
    fieldname: 'file',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 500000,
    buffer: Buffer.from('test'),
  };

  const mockCreateMediaDto: CreateMediaDto = {
    description: 'Test description',
  };

  const mockMedia = createMockMedia({ organizationId: 31 });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMediaService,
        {
          provide: getRepositoryToken(MediaEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateMediaService>(CreateMediaService);
    mediaRepository = module.get(getRepositoryToken(MediaEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMedia', () => {
    it('should upload file and create media record successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      const result = await service.createMedia(mockFile, mockCreateMediaDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(vercelBlob.put).toHaveBeenCalledWith(
        expect.stringContaining('media/31/'),
        mockFile.buffer,
        {
          access: 'public',
          contentType: 'image/jpeg',
        }
      );
      expect(mediaRepository.create).toHaveBeenCalledWith({
        url: 'https://blob.vercel-storage.com/test.jpg',
        description: 'Test description',
        organizationId: 31,
      });
      expect(mediaRepository.save).toHaveBeenCalledWith(mockMedia);
      expect(result).toEqual(mockMedia);
    });

    it('should create media without description', async () => {
      const dtoWithoutDescription: CreateMediaDto = {
        description: null,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(mockFile, dtoWithoutDescription);

      expect(mediaRepository.create).toHaveBeenCalledWith({
        url: 'https://blob.vercel-storage.com/test.jpg',
        description: null,
        organizationId: 31,
      });
    });

    it('should sanitize filename with special characters', async () => {
      const fileWithSpecialChars: IUploadedFile = {
        ...mockFile,
        originalname: 'test image@#$%.jpg',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(fileWithSpecialChars, mockCreateMediaDto);

      expect(vercelBlob.put).toHaveBeenCalledWith(
        expect.stringMatching(/test-image----\.jpg$/),
        fileWithSpecialChars.buffer,
        expect.any(Object)
      );
    });

    it('should use timestamp in filename', async () => {
      const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1234567890);

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(mockFile, mockCreateMediaDto);

      expect(vercelBlob.put).toHaveBeenCalledWith(
        'media/31/1234567890-test-image.jpg',
        mockFile.buffer,
        expect.any(Object)
      );

      dateSpy.mockRestore();
    });

    it('should handle null organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(mockFile, mockCreateMediaDto);

      expect(vercelBlob.put).toHaveBeenCalledWith(
        expect.stringContaining('media/undefined/'),
        mockFile.buffer,
        expect.any(Object)
      );
      expect(mediaRepository.create).toHaveBeenCalledWith({
        url: 'https://blob.vercel-storage.com/test.jpg',
        description: 'Test description',
        organizationId: undefined,
      });
    });

    it('should handle vercel blob upload error', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockRejectedValue(
        new Error('Upload failed')
      );

      await expect(
        service.createMedia(mockFile, mockCreateMediaDto)
      ).rejects.toThrow('Upload failed');

      expect(mediaRepository.save).not.toHaveBeenCalled();
    });

    it('should handle database save error', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createMedia(mockFile, mockCreateMediaDto)
      ).rejects.toThrow('Database error');
    });

    it('should handle different file types', async () => {
      const pngFile: IUploadedFile = {
        ...mockFile,
        originalname: 'test.png',
        mimetype: 'image/png',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.png',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(pngFile, mockCreateMediaDto);

      expect(vercelBlob.put).toHaveBeenCalledWith(
        expect.any(String),
        pngFile.buffer,
        {
          access: 'public',
          contentType: 'image/png',
        }
      );
    });

    it('should handle empty description string', async () => {
      const dtoWithEmptyDescription: CreateMediaDto = {
        description: '',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(mockFile, dtoWithEmptyDescription);

      expect(mediaRepository.create).toHaveBeenCalledWith({
        url: 'https://blob.vercel-storage.com/test.jpg',
        description: null,
        organizationId: 31,
      });
    });

    it('should properly type file buffer', async () => {
      const largeBuffer = Buffer.alloc(1024 * 500); // 500KB
      const fileWithLargeBuffer: IUploadedFile = {
        ...mockFile,
        buffer: largeBuffer,
        size: largeBuffer.length,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      (vercelBlob.put as jest.Mock).mockResolvedValue({
        url: 'https://blob.vercel-storage.com/test.jpg',
      });
      mediaRepository.create.mockReturnValue(mockMedia as any);
      mediaRepository.save.mockResolvedValue(mockMedia as any);

      await service.createMedia(fileWithLargeBuffer, mockCreateMediaDto);

      expect(vercelBlob.put).toHaveBeenCalledWith(
        expect.any(String),
        largeBuffer,
        expect.any(Object)
      );
    });
  });
});
