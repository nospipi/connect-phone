// apps/api/src/resources/countries/services/get-all-countries-of-org/controller.ts
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { GetAllCountriesOfOrgService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { ICountry } from '@connect-phone/shared-types';
import { SearchCountriesDto } from './search-countries.dto';

//------------------------------------------------------

@Controller('countries')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllCountriesOfOrgController {
  constructor(
    private readonly getAllCountriesOfOrgService: GetAllCountriesOfOrgService
  ) {}

  @Get()
  async getAllCountries(
    @Query() searchCountriesDto: SearchCountriesDto
  ): Promise<ICountry[]> {
    return this.getAllCountriesOfOrgService.getAllCountries(
      searchCountriesDto.search || '',
      searchCountriesDto.region || 'all'
    );
  }
}
