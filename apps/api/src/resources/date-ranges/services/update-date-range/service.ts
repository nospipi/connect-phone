// apps/api/src/resources/date-ranges/services/update-date-range/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { UpdateDateRangeDto } from './update-date-range.dto';
import { IDateRange } from '@connect-phone/shared-types';

@Injectable()
export class UpdateDateRangeService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>
  ) {}

  async updateDateRange(
    updateDateRangeDto: UpdateDateRangeDto
  ): Promise<IDateRange> {
    if (!updateDateRangeDto.id) {
      throw new NotFoundException('Date range ID is required');
    }

    const dateRange = await this.dateRangeRepository.findOne({
      where: { id: updateDateRangeDto.id },
    });

    if (!dateRange) {
      throw new NotFoundException(
        `Date range with ID ${updateDateRangeDto.id} not found`
      );
    }

    if (updateDateRangeDto.startDate !== undefined) {
      dateRange.startDate = updateDateRangeDto.startDate;
    }
    if (updateDateRangeDto.endDate !== undefined) {
      dateRange.endDate = updateDateRangeDto.endDate;
    }

    return this.dateRangeRepository.save(dateRange);
  }
}
