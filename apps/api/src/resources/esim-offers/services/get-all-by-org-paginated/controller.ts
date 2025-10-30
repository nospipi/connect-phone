// apps/api/src/resources/esim-offers/services/get-all-by-org-paginated/controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { IEsimOffer } from '@connect-phone/shared-types';
import { SearchEsimOffersDto } from './search-esim-offers.dto';

//----------------------------------------------------------------------

@Controller('esim-offers')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllByOrgPaginatedController {
  constructor(
    private readonly getAllByOrgPaginatedService: GetAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async getAllEsimOffersPaginated(
    @Query() searchEsimOffersDto: SearchEsimOffersDto
  ): Promise<Pagination<IEsimOffer>> {
    console.log('esim-offers/paginated Received DTO:', searchEsimOffersDto);
    return this.getAllByOrgPaginatedService.getAllEsimOffersPaginated(
      searchEsimOffersDto
    );
  }
}
