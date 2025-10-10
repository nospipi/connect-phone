// apps/api/src/resources/date-ranges/services/delete-date-range/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { IDateRange } from '@connect-phone/shared-types';

@Injectable()
export class DeleteDateRangeService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>
  ) {}

  async deleteDateRange(dateRangeId: number): Promise<IDateRange> {
    const dateRange = await this.dateRangeRepository.findOne({
      where: { id: dateRangeId },
    });

    if (!dateRange) {
      throw new NotFoundException(
        `Date range with ID ${dateRangeId} not found`
      );
    }

    await this.dateRangeRepository.remove(dateRange);
    return dateRange;
  }
}
