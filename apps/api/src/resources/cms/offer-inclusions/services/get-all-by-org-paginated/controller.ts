// apps/api/src/resources/offer-inclusions/services/get-all-by-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { SearchOfferInclusionsDto } from './search-offer-inclusions.dto';

//----------------------------------------------------------------------

@Controller('offer-inclusions')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllByOrgPaginatedController {
  constructor(
    private readonly getAllByOrgPaginatedService: GetAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async getAllOfferInclusionsPaginated(
    @Query() searchOfferInclusionsDto: SearchOfferInclusionsDto
  ): Promise<Pagination<IOfferInclusion>> {
    return this.getAllByOrgPaginatedService.getAllOfferInclusionsPaginated(
      searchOfferInclusionsDto.page || 1,
      searchOfferInclusionsDto.limit || 10,
      searchOfferInclusionsDto.search || ''
    );
  }
}
