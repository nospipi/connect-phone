// apps/api/src/resources/prices/services/delete-price/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeletePriceService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IPrice } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('prices')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeletePriceController {
  constructor(private readonly deletePriceService: DeletePriceService) {}

  @Delete(':id')
  async deletePrice(@Param('id', ParseIntPipe) id: number): Promise<IPrice> {
    return this.deletePriceService.deletePrice(id);
  }
}
