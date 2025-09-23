// apps/api/src/resources/users/services/get-all-invitations-of-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllInvitationsOfOrgPaginatedService } from './service';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { SearchInvitationsDto } from './search-invitations.dto';

//--------------------------------------------------------------------------------

@Controller('invitations')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllInvitationsOfOrgPaginatedController {
  constructor(
    private readonly getAllInvitationsOfOrgPaginatedService: GetAllInvitationsOfOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query() searchInvitationsDto: SearchInvitationsDto
  ): Promise<Pagination<UserInvitationEntity>> {
    return this.getAllInvitationsOfOrgPaginatedService.findAllByOrganizationPaginated(
      searchInvitationsDto.page || 1,
      searchInvitationsDto.limit || 10,
      searchInvitationsDto.search || '',
      searchInvitationsDto.role || 'all',
      searchInvitationsDto.status || 'all'
    );
  }
}
