// apps/api/src/resources/date-ranges/services/update-date-range/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRangeEntity } from '../../../../../database/entities/date-range.entity';
import { UpdateDateRangeDto } from './update-date-range.dto';
import { IDateRange } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdateDateRangeService {
  constructor(
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateDateRange(
    updateDateRangeDto: UpdateDateRangeDto
  ): Promise<IDateRange> {
    if (!updateDateRangeDto.id) {
      throw new NotFoundException('Date range ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const dateRange = await this.dateRangeRepository.findOne({
      where: {
        id: updateDateRangeDto.id,
        organizationId: organization.id,
      },
    });

    if (!dateRange) {
      throw new NotFoundException(
        `Date range with ID ${updateDateRangeDto.id} not found in current organization`
      );
    }

    if (updateDateRangeDto.name !== undefined) {
      dateRange.name = updateDateRangeDto.name;
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
