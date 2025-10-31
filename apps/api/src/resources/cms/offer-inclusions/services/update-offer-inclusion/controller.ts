// apps/api/src/resources/cms/offer-inclusions/services/update-offer-inclusion/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateOfferInclusionService } from './service';
import { UpdateOfferInclusionDto } from './update-offer-inclusion.dto';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class UpdateOfferInclusionController {
  constructor(
    private readonly updateOfferInclusionService: UpdateOfferInclusionService
  ) {}

  @Put(':id')
  async updateOfferInclusion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferInclusionDto: UpdateOfferInclusionDto
  ): Promise<IOfferInclusion> {
    updateOfferInclusionDto.id = id;
    return this.updateOfferInclusionService.updateOfferInclusion(
      updateOfferInclusionDto
    );
  }
}
