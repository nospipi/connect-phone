// apps/api/src/resources/offer-inclusions/services/delete-offer-inclusion/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeleteOfferInclusionService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IOfferInclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('offer-inclusions')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteOfferInclusionController {
  constructor(
    private readonly deleteOfferInclusionService: DeleteOfferInclusionService
  ) {}

  @Delete(':id')
  async deleteOfferInclusion(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IOfferInclusion> {
    return this.deleteOfferInclusionService.deleteOfferInclusion(id);
  }
}
