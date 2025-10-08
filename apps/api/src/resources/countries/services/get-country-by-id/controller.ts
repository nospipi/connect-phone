// apps/api/src/resources/countries/services/get-country-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GetCountryByIdService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { ICountry } from '@connect-phone/shared-types';

//-----------------------------------------------------------------------

@Controller('countries')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetCountryByIdController {
  constructor(private readonly getCountryByIdService: GetCountryByIdService) {}

  @Get(':id')
  async getCountryById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ICountry> {
    try {
      const country = await this.getCountryByIdService.getCountryById(id);
      return country;
    } catch (error) {
      console.error('Error retrieving country by ID:', error);
      throw error;
    }
  }
}
