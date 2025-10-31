// apps/api/src/resources/media/services/get-media-by-id/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '@/database/entities/media.entity';
import { IMedia } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetMediaByIdService {
  constructor(
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getMediaById(mediaId: number): Promise<IMedia> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const media = await this.mediaRepository.findOne({
      where: {
        id: mediaId,
        organizationId: organization.id,
      },
      relations: ['organization'],
    });

    if (!media) {
      throw new NotFoundException(
        `Media with ID ${mediaId} not found in current organization`
      );
    }

    return media;
  }
}
