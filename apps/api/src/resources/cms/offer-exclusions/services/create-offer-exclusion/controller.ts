// apps/api/src/resources/cms/offer-exclusions/services/create-offer-exclusion/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateOfferExclusionService } from './service';
import { CreateOfferExclusionDto } from './create-offer-exclusion.dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IOfferExclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreateOfferExclusionController {
  constructor(
    private readonly createOfferExclusionService: CreateOfferExclusionService
  ) {}

  @Post('new')
  async createOfferExclusion(
    @Body() createOfferExclusionDto: CreateOfferExclusionDto
  ): Promise<IOfferExclusion> {
    return this.createOfferExclusionService.createOfferExclusion(
      createOfferExclusionDto
    );
  }
}
