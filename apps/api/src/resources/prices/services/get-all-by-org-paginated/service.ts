// apps/api/src/resources/prices/services/get-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from '../../../../database/entities/price.entity';
import { IPrice } from '@connect-phone/shared-types';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllPricesPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<Pagination<IPrice>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/prices/paginated`,
    };

    const queryBuilder = this.priceRepository
      .createQueryBuilder('price')
      .leftJoinAndSelect('price.dateRanges', 'dateRanges')
      .leftJoinAndSelect('price.salesChannels', 'salesChannels')
      .where('price.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('price.createdAt', 'DESC');

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere('price.name ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return paginate<PriceEntity>(queryBuilder, options);
  }
}
