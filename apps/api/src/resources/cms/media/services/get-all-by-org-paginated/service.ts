// apps/api/src/resources/cms/media/services/get-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '@/database/entities/media.entity';
import { IMedia } from '@connect-phone/shared-types';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllMediaPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<Pagination<IMedia>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/media/paginated`,
    };

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('media.createdAt', 'DESC');

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere('media.description ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return paginate<MediaEntity>(queryBuilder, options);
  }
}
