// apps/api/src/resources/prices/services/get-price-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GetPriceByIdService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IPrice } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('prices')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetPriceByIdController {
  constructor(private readonly getPriceByIdService: GetPriceByIdService) {}

  @Get(':id')
  async getPriceById(@Param('id', ParseIntPipe) id: number): Promise<IPrice> {
    return this.getPriceByIdService.getPriceById(id);
  }
}
