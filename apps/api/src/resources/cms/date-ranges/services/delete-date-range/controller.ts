// apps/api/src/resources/cms/date-ranges/services/delete-date-range/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeleteDateRangeService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IDateRange } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteDateRangeController {
  constructor(
    private readonly deleteDateRangeService: DeleteDateRangeService
  ) {}

  @Delete(':id')
  async deleteDateRange(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IDateRange> {
    return this.deleteDateRangeService.deleteDateRange(id);
  }
}
