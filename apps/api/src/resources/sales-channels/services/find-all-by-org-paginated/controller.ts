// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '@/common/guards/organization.guard';

@Controller('sales-channels')
@UseGuards(OrganizationGuard)
export class FindAllByOrgPaginatedController {
  constructor(
    private readonly findAllByOrgPaginatedService: FindAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<SalesChannel>> {
    return this.findAllByOrgPaginatedService.findAllByOrganizationPaginated(
      page,
      limit
    );
  }
}
