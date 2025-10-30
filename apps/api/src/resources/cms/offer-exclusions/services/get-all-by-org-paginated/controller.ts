// apps/api/src/resources/cms/offer-exclusions/services/get-all-by-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { SearchOfferExclusionsDto } from './search-offer-exclusions.dto';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllByOrgPaginatedController {
  constructor(
    private readonly getAllByOrgPaginatedService: GetAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async getAllOfferExclusionsPaginated(
    @Query() searchOfferExclusionsDto: SearchOfferExclusionsDto
  ): Promise<Pagination<IOfferExclusion>> {
    return this.getAllByOrgPaginatedService.getAllOfferExclusionsPaginated(
      searchOfferExclusionsDto.page || 1,
      searchOfferExclusionsDto.limit || 10,
      searchOfferExclusionsDto.search || ''
    );
  }
}
