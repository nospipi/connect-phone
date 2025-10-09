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
import { AuditLogEntryEntity } from '../../../../database/entities/audit-log.entity';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { IAuditLog } from '@connect-phone/shared-types';

//--------------------------------------------------------------------------------

@Controller('audit-logs')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class FindAllByOrgPaginatedController {
  constructor(
    private readonly findAllByOrgPaginatedService: FindAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number
  ): Promise<Pagination<IAuditLog>> {
    return this.findAllByOrgPaginatedService.findAllByOrganizationPaginated(
      page,
      limit
    );
  }
}
