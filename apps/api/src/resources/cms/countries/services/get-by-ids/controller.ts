// apps/api/src/resources/countries/services/get-by-ids/controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GetCountriesByIdsService } from './service';
import { GetCountriesByIdsQueryDto } from './dto';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { ICountry } from '@connect-phone/shared-types';

//------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetCountriesByIdsController {
  constructor(
    private readonly getCountriesByIdsService: GetCountriesByIdsService
  ) {}

  @Get('by-ids')
  async getCountriesByIds(
    @Query() query: GetCountriesByIdsQueryDto
  ): Promise<ICountry[]> {
    const ids = query.ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException('At least one valid ID is required');
    }

    return this.getCountriesByIdsService.getCountriesByIds(ids);
  }
}
