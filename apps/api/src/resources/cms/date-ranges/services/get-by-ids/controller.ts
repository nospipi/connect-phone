// apps/api/src/resources/cms/date-ranges/services/get-by-ids/controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GetDateRangesByIdsService } from './service';
import { GetDateRangesByIdsQueryDto } from './dto';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IDateRange } from '@connect-phone/shared-types';

//------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetDateRangesByIdsController {
  constructor(
    private readonly getDateRangesByIdsService: GetDateRangesByIdsService
  ) {}

  @Get('by-ids')
  async getDateRangesByIds(
    @Query() query: GetDateRangesByIdsQueryDto
  ): Promise<IDateRange[]> {
    const ids = query.ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException('At least one valid ID is required');
    }

    return this.getDateRangesByIdsService.getDateRangesByIds(ids);
  }
}
