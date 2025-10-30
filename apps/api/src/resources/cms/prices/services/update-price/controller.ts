// apps/api/src/resources/cms/prices/services/update-price/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdatePriceService } from './service';
import { UpdatePriceDto } from './update-price.dto';
import { IPrice } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class UpdatePriceController {
  constructor(private readonly updatePriceService: UpdatePriceService) {}

  @Put(':id')
  async updatePrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePriceDto: UpdatePriceDto
  ): Promise<IPrice> {
    console.log(
      'UpdatePriceController: updatePrice called with id:',
      id,
      'and dto:',
      updatePriceDto
    );
    updatePriceDto.id = id;
    return this.updatePriceService.updatePrice(updatePriceDto);
  }
}
