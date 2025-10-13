// apps/api/src/resources/media/services/create-media/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { put } from '@vercel/blob';
import { MediaEntity } from '../../../../database/entities/media.entity';
import { IMedia } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

@Injectable()
export class CreateMediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async createMedia(file: any, description?: string): Promise<IMedia> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    const filename = `media/${organization?.id}/${timestamp}-${sanitizedFilename}`;

    const blob = await put(filename, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    });

    const media = this.mediaRepository.create({
      url: blob.url,
      description: description || null,
      organizationId: organization?.id,
    });

    return this.mediaRepository.save(media);
  }
}
