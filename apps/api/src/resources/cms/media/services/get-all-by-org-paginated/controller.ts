// apps/api/src/resources/cms/media/services/get-all-by-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { IMedia } from '@connect-phone/shared-types';
import { SearchMediaDto } from './search-media.dto';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllByOrgPaginatedController {
  constructor(
    private readonly getAllByOrgPaginatedService: GetAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async getAllMediaPaginated(
    @Query() searchMediaDto: SearchMediaDto
  ): Promise<Pagination<IMedia>> {
    return this.getAllByOrgPaginatedService.getAllMediaPaginated(
      searchMediaDto.page || 1,
      searchMediaDto.limit || 10,
      searchMediaDto.search || ''
    );
  }
}
