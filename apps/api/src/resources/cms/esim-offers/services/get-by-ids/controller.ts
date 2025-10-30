// apps/api/src/resources/cms/esim-offers/services/get-by-ids/controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GetEsimOffersByIdsService } from './service';
import { GetEsimOffersByIdsQueryDto } from './dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IEsimOffer } from '@connect-phone/shared-types';

//------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetEsimOffersByIdsController {
  constructor(
    private readonly getEsimOffersByIdsService: GetEsimOffersByIdsService
  ) {}

  @Get('by-ids')
  async getEsimOffersByIds(
    @Query() query: GetEsimOffersByIdsQueryDto
  ): Promise<IEsimOffer[]> {
    const ids = query.ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException('At least one valid ID is required');
    }

    return this.getEsimOffersByIdsService.getEsimOffersByIds(ids);
  }
}
