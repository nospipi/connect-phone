// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('sales-channels')
export class FindAllByOrgPaginatedController {
  constructor(
    private readonly findAllByOrgPaginatedService: FindAllByOrgPaginatedService
  ) {}

  @Get('organization/:organizationId/paginated')
  async findAllByOrganizationPaginated(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<SalesChannel>> {
    console.log(
      'Fetching paginated sales channels for organization:',
      organizationId,
      'page:',
      page,
      'limit:',
      limit
    );
    return this.findAllByOrgPaginatedService.findAllByOrganizationPaginated(
      organizationId,
      page,
      limit
    );
  }
}
