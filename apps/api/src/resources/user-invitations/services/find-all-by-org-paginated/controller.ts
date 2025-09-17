// apps/api/src/resources/user-invitations/services/find-all-by-org-paginated/controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { UserInvitation } from '../../../../database/entities/user-invitation.entity';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

@Controller('user-invitations')
@UseGuards(DbUserGuard, OrganizationGuard)
export class FindAllByOrgPaginatedController {
  constructor(
    private readonly findAllByOrgPaginatedService: FindAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async findAllByOrganizationPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<UserInvitation>> {
    return this.findAllByOrgPaginatedService.findAllByOrganizationPaginated(
      page,
      limit
    );
  }
}
