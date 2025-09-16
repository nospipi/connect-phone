// apps/api/src/resources/users/services/get-all-users-of-org-paginated/controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { GetAllUsersOfOrgPaginatedService } from './service';
import { UserOrganization } from '../../../../database/entities/user-organization.entity';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '@/common/guards/organization.guard';

//--------------------------------------------------------------------------------

@Controller('users')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllUsersOfOrgPaginatedController {
  constructor(
    private readonly getAllUsersOfOrgPaginatedService: GetAllUsersOfOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<UserOrganization>> {
    return this.getAllUsersOfOrgPaginatedService.findAllByOrganizationPaginated(
      page,
      limit
    );
  }
}
