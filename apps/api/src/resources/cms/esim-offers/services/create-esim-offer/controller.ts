// apps/api/src/resources/esim-offers/services/create-esim-offer/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateEsimOfferService } from './service';
import { CreateEsimOfferDto } from './create-esim-offer.dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IEsimOffer } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('esim-offers')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreateEsimOfferController {
  constructor(
    private readonly createEsimOfferService: CreateEsimOfferService
  ) {}

  @Post('new')
  async createEsimOffer(
    @Body() createEsimOfferDto: CreateEsimOfferDto
  ): Promise<IEsimOffer> {
    return this.createEsimOfferService.createEsimOffer(createEsimOfferDto);
  }
}
