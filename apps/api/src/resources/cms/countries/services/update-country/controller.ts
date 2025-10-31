// apps/api/src/resources/cms/countries/services/update-country/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateCountryService } from './service';
import { UpdateCountryDto } from './update-country.dto';
import { ICountry } from '@connect-phone/shared-types';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

//------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class UpdateCountryController {
  constructor(private readonly updateCountryService: UpdateCountryService) {}

  @Put(':id')
  async updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto
  ): Promise<ICountry> {
    updateCountryDto.id = id;
    return this.updateCountryService.updateCountry(updateCountryDto);
  }
}
