// apps/api/src/resources/cms/offer-exclusions/services/delete-offer-exclusion/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeleteOfferExclusionService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IOfferExclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteOfferExclusionController {
  constructor(
    private readonly deleteOfferExclusionService: DeleteOfferExclusionService
  ) {}

  @Delete(':id')
  async deleteOfferExclusion(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IOfferExclusion> {
    return this.deleteOfferExclusionService.deleteOfferExclusion(id);
  }
}
