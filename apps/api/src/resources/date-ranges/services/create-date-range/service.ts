// apps/api/src/resources/date-ranges/services/create-date-range/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '../../../../database/entities/date-range.entity';
import { CreateDateRangeDto } from './create-date-range.dto';
import { IDateRange } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class CreateDateRangeService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async createDateRange(
    createDateRangeDto: CreateDateRangeDto
  ): Promise<IDateRange> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const dateRange = this.dateRangeRepository.create({
      ...createDateRangeDto,
      organizationId: organization?.id,
    });

    return this.dateRangeRepository.save(dateRange);
  }
}
