// apps/api/src/resources/date-ranges/services/create-date-range/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { CreateDateRangeDto } from './create-date-range.dto';
import { IDateRange } from '@connect-phone/shared-types';

@Injectable()
export class CreateDateRangeService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>
  ) {}

  async createDateRange(
    createDateRangeDto: CreateDateRangeDto
  ): Promise<IDateRange> {
    const dateRange = this.dateRangeRepository.create(createDateRangeDto);
    return this.dateRangeRepository.save(dateRange);
  }
}
