// apps/api/src/resources/cms/date-ranges/services/get-by-ids/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { IDateRange } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class GetDateRangesByIdsService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getDateRangesByIds(ids: number[]): Promise<IDateRange[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.dateRangeRepository.find({
      where: {
        id: In(ids),
        organizationId: organization?.id,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
