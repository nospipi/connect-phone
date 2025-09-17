// apps/api/src/resources/users/services/get-all-users-of-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllUsersOfOrgPaginatedService } from './service';
import { UserOrganization } from '../../../../database/entities/user-organization.entity';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { SearchUsersDto } from './search-users.dto';

//--------------------------------------------------------------------------------

@Controller('users')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllUsersOfOrgPaginatedController {
  constructor(
    private readonly getAllUsersOfOrgPaginatedService: GetAllUsersOfOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query() searchUsersDto: SearchUsersDto
  ): Promise<Pagination<UserOrganization>> {
    return this.getAllUsersOfOrgPaginatedService.findAllByOrganizationPaginated(
      searchUsersDto.page || 1,
      searchUsersDto.limit || 10,
      searchUsersDto.search || '',
      searchUsersDto.role || 'all'
    );
  }
}
