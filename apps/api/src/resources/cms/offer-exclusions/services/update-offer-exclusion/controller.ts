// apps/api/src/resources/cms/offer-exclusions/services/update-offer-exclusion/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateOfferExclusionService } from './service';
import { UpdateOfferExclusionDto } from './update-offer-exclusion.dto';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class UpdateOfferExclusionController {
  constructor(
    private readonly updateOfferExclusionService: UpdateOfferExclusionService
  ) {}

  @Put(':id')
  async updateOfferExclusion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferExclusionDto: UpdateOfferExclusionDto
  ): Promise<IOfferExclusion> {
    updateOfferExclusionDto.id = id;
    return this.updateOfferExclusionService.updateOfferExclusion(
      updateOfferExclusionDto
    );
  }
}
