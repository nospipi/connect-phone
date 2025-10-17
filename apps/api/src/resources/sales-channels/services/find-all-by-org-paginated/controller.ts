// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { SearchSalesChannelsDto } from './search-sales-channels.dto';

//----------------------------------------------------------------------

@Controller('sales-channels')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class FindAllByOrgPaginatedController {
  constructor(
    private readonly findAllByOrgPaginatedService: FindAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query() searchSalesChannelsDto: SearchSalesChannelsDto
  ): Promise<Pagination<SalesChannelEntity>> {
    console.log(
      'Controller - Fetching sales channels for organization with params:',
      searchSalesChannelsDto
    );
    return this.findAllByOrgPaginatedService.findAllByOrganizationPaginated(
      searchSalesChannelsDto.page || 1,
      searchSalesChannelsDto.limit || 10,
      searchSalesChannelsDto.search || ''
    );
  }
}
