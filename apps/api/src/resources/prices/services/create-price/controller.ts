// apps/api/src/resources/prices/services/create-price/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreatePriceService } from './service';
import { CreatePriceDto } from './create-price.dto';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IPrice } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('prices')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreatePriceController {
  constructor(private readonly createPriceService: CreatePriceService) {}

  @Post('new')
  async createPrice(@Body() createPriceDto: CreatePriceDto): Promise<IPrice> {
    return this.createPriceService.createPrice(createPriceDto);
  }
}
