// apps/api/src/resources/date-ranges/services/update-date-range/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateDateRangeService } from './service';
import { UpdateDateRangeDto } from './update-date-range.dto';
import { IDateRange } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

@Controller('date-ranges')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class UpdateDateRangeController {
  constructor(
    private readonly updateDateRangeService: UpdateDateRangeService
  ) {}

  @Put(':id')
  async updateDateRange(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDateRangeDto: UpdateDateRangeDto
  ): Promise<IDateRange> {
    updateDateRangeDto.id = id;
    return this.updateDateRangeService.updateDateRange(updateDateRangeDto);
  }
}
