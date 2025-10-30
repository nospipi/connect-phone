// apps/api/src/resources/cms/sales-channels/services/get-by-ids/controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GetSalesChannelsByIdsService } from './service';
import { GetSalesChannelsByIdsQueryDto } from './dto';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { ISalesChannel } from '@connect-phone/shared-types';

//------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetSalesChannelsByIdsController {
  constructor(
    private readonly getSalesChannelsByIdsService: GetSalesChannelsByIdsService
  ) {}

  @Get('by-ids')
  async getSalesChannelsByIds(
    @Query() query: GetSalesChannelsByIdsQueryDto
  ): Promise<ISalesChannel[]> {
    const ids = query.ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException('At least one valid ID is required');
    }

    return this.getSalesChannelsByIdsService.getSalesChannelsByIds(ids);
  }
}
