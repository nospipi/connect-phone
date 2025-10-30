// apps/api/src/resources/esim-offers/services/get-esim-offer-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GetEsimOfferByIdService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IEsimOffer } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('esim-offers')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetEsimOfferByIdController {
  constructor(
    private readonly getEsimOfferByIdService: GetEsimOfferByIdService
  ) {}

  @Get(':id')
  async getEsimOfferById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IEsimOffer> {
    return this.getEsimOfferByIdService.getEsimOfferById(id);
  }
}
