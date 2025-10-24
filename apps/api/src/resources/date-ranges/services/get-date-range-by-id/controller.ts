// apps/api/src/resources/date-ranges/services/get-date-range-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GetDateRangeByIdService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IDateRange } from '@connect-phone/shared-types';

//------------------------------------------------------

@Controller('date-ranges')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetDateRangeByIdController {
  constructor(
    private readonly getDateRangeByIdService: GetDateRangeByIdService
  ) {}

  @Get(':id')
  async getDateRangeById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IDateRange> {
    return this.getDateRangeByIdService.getDateRangeById(id);
  }
}
