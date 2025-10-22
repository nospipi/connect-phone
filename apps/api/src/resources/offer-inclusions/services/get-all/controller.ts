// apps/api/src/resources/offer-inclusions/services/get-all/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllOfferInclusionsService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IOfferInclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('offer-inclusions')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllOfferInclusionsController {
  constructor(
    private readonly getAllOfferInclusionsService: GetAllOfferInclusionsService
  ) {}

  @Get('all')
  async getAllOfferInclusions(): Promise<IOfferInclusion[]> {
    return this.getAllOfferInclusionsService.getAllOfferInclusions();
  }
}
