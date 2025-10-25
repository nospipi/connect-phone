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
      .where('price.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('price.id', 'DESC');

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
      queryBuilder
        .leftJoin('price.dateRanges', 'dateRanges')
        .andWhere('dateRanges.id IN (:...dateRangeIds)', {
          dateRangeIds: searchDto.dateRangeIds,
        });
    }

    if (searchDto.salesChannelIds && searchDto.salesChannelIds.length > 0) {
      queryBuilder
        .leftJoin('price.salesChannels', 'salesChannels')
        .andWhere('salesChannels.id IN (:...salesChannelIds)', {
          salesChannelIds: searchDto.salesChannelIds,
        });
    }

    const paginationResult = await paginate<PriceEntity>(queryBuilder, options);

    const priceIds = paginationResult.items.map((price) => price.id);

    if (priceIds.length > 0) {
      const pricesWithRelations = await this.priceRepository
        .createQueryBuilder('price')
        .leftJoinAndSelect('price.dateRanges', 'dateRanges')
        .leftJoinAndSelect('price.salesChannels', 'salesChannels')
        .whereInIds(priceIds)
        .getMany();

      const priceMap = new Map(
        pricesWithRelations.map((price) => [price.id, price])
      );

      const itemsWithRelations = paginationResult.items.map(
        (price) => priceMap.get(price.id) || price
      );

      return {
        ...paginationResult,
        items: itemsWithRelations,
      };
    }

    return paginationResult;
  }
}
