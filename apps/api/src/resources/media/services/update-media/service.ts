// apps/api/src/resources/media/services/update-media/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../database/entities/media.entity';
import { UpdateMediaDto } from './update-media.dto';
import { IMedia } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdateMediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateMedia(updateMediaDto: UpdateMediaDto): Promise<IMedia> {
    if (!updateMediaDto.id) {
      throw new NotFoundException('Media ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const media = await this.mediaRepository.findOne({
      where: {
        id: updateMediaDto.id,
        organizationId: organization.id,
      },
    });

    if (!media) {
      throw new NotFoundException(
        `Media with ID ${updateMediaDto.id} not found in current organization`
      );
    }

    if (updateMediaDto.description !== undefined) {
      media.description = updateMediaDto.description;
    }

    return this.mediaRepository.save(media);
  }
}
