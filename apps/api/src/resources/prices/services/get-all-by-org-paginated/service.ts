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
import { SearchPricesDto } from './search-prices.dto';

//----------------------------------------------------------------------

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllPricesPaginated(
    searchDto: SearchPricesDto
  ): Promise<Pagination<IPrice>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page: searchDto.page || 1,
      limit: Math.min(Math.max(searchDto.limit || 10, 1), 100),
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

    if (searchDto.search && searchDto.search.trim().length > 0) {
      queryBuilder.andWhere('price.name ILIKE :search', {
        search: `%${searchDto.search.trim()}%`,
      });
    }

    if (searchDto.minAmount !== undefined) {
      queryBuilder.andWhere('price.amount >= :minAmount', {
        minAmount: searchDto.minAmount,
      });
    }

    if (searchDto.maxAmount !== undefined) {
      queryBuilder.andWhere('price.amount <= :maxAmount', {
        maxAmount: searchDto.maxAmount,
      });
    }

    if (searchDto.currencies && searchDto.currencies.length > 0) {
      queryBuilder.andWhere('price.currency IN (:...currencies)', {
        currencies: searchDto.currencies,
      });
    }

    if (searchDto.dateRangeIds && searchDto.dateRangeIds.length > 0) {
      queryBuilder.andWhere('dateRanges.id IN (:...dateRangeIds)', {
        dateRangeIds: searchDto.dateRangeIds,
      });
    }

    if (searchDto.salesChannelIds && searchDto.salesChannelIds.length > 0) {
      queryBuilder.andWhere('salesChannels.id IN (:...salesChannelIds)', {
        salesChannelIds: searchDto.salesChannelIds,
      });
    }

    return paginate<PriceEntity>(queryBuilder, options);
  }
}
