// apps/api/src/resources/date-ranges/services/create-date-range/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateDateRangeService } from './service';
import { CreateDateRangeDto } from './create-date-range.dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IDateRange } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('date-ranges')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreateDateRangeController {
  constructor(
    private readonly createDateRangeService: CreateDateRangeService
  ) {}

  @Post('new')
  async createDateRange(
    @Body() createDateRangeDto: CreateDateRangeDto
  ): Promise<IDateRange> {
    return this.createDateRangeService.createDateRange(createDateRangeDto);
  }
}
