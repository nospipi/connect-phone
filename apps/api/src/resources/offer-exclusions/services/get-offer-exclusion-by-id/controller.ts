// apps/api/src/resources/offer-exclusions/services/get-offer-exclusion-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GetOfferExclusionByIdService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IOfferExclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('offer-exclusions')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetOfferExclusionByIdController {
  constructor(
    private readonly getOfferExclusionByIdService: GetOfferExclusionByIdService
  ) {}

  @Get(':id')
  async getOfferExclusionById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IOfferExclusion> {
    return this.getOfferExclusionByIdService.getOfferExclusionById(id);
  }
}
