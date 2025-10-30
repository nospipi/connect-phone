// apps/api/src/resources/prices/services/get-all-by-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { IPrice } from '@connect-phone/shared-types';
import { SearchPricesDto } from './search-prices.dto';

//----------------------------------------------------------------------

@Controller('prices')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllByOrgPaginatedController {
  constructor(
    private readonly getAllByOrgPaginatedService: GetAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async getAllPricesPaginated(
    @Query() searchPricesDto: SearchPricesDto
  ): Promise<Pagination<IPrice>> {
    return this.getAllByOrgPaginatedService.getAllPricesPaginated(
      searchPricesDto
    );
  }
}
