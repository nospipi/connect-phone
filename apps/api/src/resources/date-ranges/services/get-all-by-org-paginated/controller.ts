// apps/api/src/resources/date-ranges/services/get-all-by-org-paginated/controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { GetAllByOrgPaginatedService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { IDateRange } from '@connect-phone/shared-types';
import { SearchDateRangesDto } from './search-date-ranges.dto';

//----------------------------------------------------------------------

@Controller('date-ranges')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetAllByOrgPaginatedController {
  constructor(
    private readonly getAllByOrgPaginatedService: GetAllByOrgPaginatedService
  ) {}

  @Get('paginated')
  async getAllDateRangesPaginated(
    @Query() searchDateRangesDto: SearchDateRangesDto
  ): Promise<Pagination<IDateRange>> {
    return this.getAllByOrgPaginatedService.getAllDateRangesPaginated(
      searchDateRangesDto.page || 1,
      searchDateRangesDto.limit || 10,
      searchDateRangesDto.date || '',
      searchDateRangesDto.search || ''
    );
  }
}
