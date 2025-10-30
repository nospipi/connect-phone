// apps/api/src/resources/offer-inclusions/services/get-offer-inclusion-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GetOfferInclusionByIdService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IOfferInclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('offer-inclusions')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetOfferInclusionByIdController {
  constructor(
    private readonly getOfferInclusionByIdService: GetOfferInclusionByIdService
  ) {}

  @Get(':id')
  async getOfferInclusionById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IOfferInclusion> {
    return this.getOfferInclusionByIdService.getOfferInclusionById(id);
  }
}
