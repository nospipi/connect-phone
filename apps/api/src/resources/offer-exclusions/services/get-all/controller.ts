// apps/api/src/resources/offer-exclusions/services/get-all/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllOfferExclusionsService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IOfferExclusion } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('offer-exclusions')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllOfferExclusionsController {
  constructor(
    private readonly getAllOfferExclusionsService: GetAllOfferExclusionsService
  ) {}

  @Get('all')
  async getAllOfferExclusions(): Promise<IOfferExclusion[]> {
    return this.getAllOfferExclusionsService.getAllOfferExclusions();
  }
}
