// apps/api/src/resources/esim-offers/services/update-esim-offer/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateEsimOfferService } from './service';
import { UpdateEsimOfferDto } from './update-esim-offer.dto';
import { IEsimOffer } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';

//----------------------------------------------------------------------

@Controller('esim-offers')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class UpdateEsimOfferController {
  constructor(
    private readonly updateEsimOfferService: UpdateEsimOfferService
  ) {}

  @Put(':id')
  async updateEsimOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEsimOfferDto: UpdateEsimOfferDto
  ): Promise<IEsimOffer> {
    updateEsimOfferDto.id = id;
    return this.updateEsimOfferService.updateEsimOffer(updateEsimOfferDto);
  }
}
