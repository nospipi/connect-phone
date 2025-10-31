// apps/api/src/resources/date-ranges/services/delete-date-range/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { IDateRange } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class DeleteDateRangeService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async deleteDateRange(dateRangeId: number): Promise<IDateRange> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const dateRange = await this.dateRangeRepository.findOne({
      where: {
        id: dateRangeId,
        organizationId: organization.id,
      },
    });

    if (!dateRange) {
      throw new NotFoundException(
        `Date range with ID ${dateRangeId} not found in current organization`
      );
    }

    await this.dateRangeRepository.remove(dateRange);
    return dateRange;
  }
}
