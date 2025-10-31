// apps/api/src/resources/cms/media/services/get-by-ids/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MediaEntity } from '@/database/entities/media.entity';
import { IMedia } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class GetMediaByIdsService {
  constructor(
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getMediaByIds(ids: number[]): Promise<IMedia[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.mediaRepository.find({
      where: {
        id: In(ids),
        organizationId: organization?.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
