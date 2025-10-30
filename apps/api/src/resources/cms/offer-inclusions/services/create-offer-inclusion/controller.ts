// apps/api/src/resources/cms/offer-inclusions/services/create-offer-inclusion/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateOfferInclusionService } from './service';
import { CreateOfferInclusionDto } from './create-offer-inclusion.dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IOfferInclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreateOfferInclusionController {
  constructor(
    private readonly createOfferInclusionService: CreateOfferInclusionService
  ) {}

  @Post('new')
  async createOfferInclusion(
    @Body() createOfferInclusionDto: CreateOfferInclusionDto
  ): Promise<IOfferInclusion> {
    return this.createOfferInclusionService.createOfferInclusion(
      createOfferInclusionDto
    );
  }
}
