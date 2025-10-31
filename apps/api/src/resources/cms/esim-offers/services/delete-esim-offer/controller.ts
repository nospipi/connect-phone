// apps/api/src/resources/cms/esim-offers/services/delete-esim-offer/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeleteEsimOfferService } from './service';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IEsimOffer } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteEsimOfferController {
  constructor(
    private readonly deleteEsimOfferService: DeleteEsimOfferService
  ) {}

  @Delete(':id')
  async deleteEsimOffer(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IEsimOffer> {
    return this.deleteEsimOfferService.deleteEsimOffer(id);
  }
}
