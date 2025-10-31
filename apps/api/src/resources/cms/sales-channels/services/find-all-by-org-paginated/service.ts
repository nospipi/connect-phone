// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//----------------------------------------------------------------------

@Injectable()
export class FindAllByOrgPaginatedService {
  constructor(
    @InjectRepository(SalesChannelEntity)
    private salesChannelsRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<Pagination<SalesChannelEntity>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/sales-channels/paginated`,
    };

    const queryBuilder = this.salesChannelsRepository
      .createQueryBuilder('salesChannel')
      .leftJoinAndSelect('salesChannel.organization', 'organization')
      .leftJoinAndSelect('salesChannel.logo', 'logo')
      .where('salesChannel.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('salesChannel.id', 'DESC');

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere('salesChannel.name ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return paginate<SalesChannelEntity>(queryBuilder, options);
  }
}
