// apps/api/src/resources/date-ranges/services/get-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { IDateRange } from '@connect-phone/shared-types';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>
  ) {}

  async getAllDateRangesPaginated(
    page: number = 1,
    limit: number = 10,
    date: string = ''
  ): Promise<Pagination<IDateRange>> {
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/date-ranges/paginated`,
    };

    const queryBuilder = this.dateRangeRepository
      .createQueryBuilder('dateRange')
      .orderBy('dateRange.startDate', 'ASC');

    if (date && date.trim().length > 0) {
      queryBuilder.andWhere(
        'dateRange.startDate <= :date AND dateRange.endDate >= :date',
        { date: date.trim() }
      );
    }

    return paginate<DateRangeEntity>(queryBuilder, options);
  }
}
