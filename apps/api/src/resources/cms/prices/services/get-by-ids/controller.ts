// apps/api/src/resources/cms/prices/services/get-by-ids/controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GetPricesByIdsService } from './service';
import { GetPricesByIdsQueryDto } from './dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IPrice } from '@connect-phone/shared-types';

//------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetPricesByIdsController {
  constructor(private readonly getPricesByIdsService: GetPricesByIdsService) {}

  @Get('by-ids')
  async getPricesByIds(
    @Query() query: GetPricesByIdsQueryDto
  ): Promise<IPrice[]> {
    const ids = query.ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException('At least one valid ID is required');
    }

    return this.getPricesByIdsService.getPricesByIds(ids);
  }
}
