// apps/api/src/resources/cms/sales-channels/services/find-all-by-org-paginated/controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { IAuditLog } from '@connect-phone/shared-types';
import { NoCache } from '@/common/decorators/no-cache.decorator';

//--------------------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class FindAllByOrgPaginatedController {
  constructor(
    private readonly findAllByOrgPaginatedService: FindAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  @NoCache() //because audit logs are not added through mutation methods (added with database subscriber), cache is not invalidated, so we disable caching here
  async findAllByOrganizationPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number
  ): Promise<Pagination<IAuditLog>> {
    return this.findAllByOrgPaginatedService.findAllByOrganizationPaginated(
      page,
      limit
    );
  }
}
