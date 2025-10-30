// apps/api/src/resources/cms/organizations/services/get-current-organization/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentOrganizationService } from './service';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IOrganization } from '@connect-phone/shared-types';
import { NoCache } from '@/common/decorators/no-cache.decorator';

//------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetCurrentOrganizationController {
  constructor(
    private readonly getCurrentOrganizationService: GetCurrentOrganizationService
  ) {}

  @Get('current')
  @NoCache()
  async getCurrentOrganization(): Promise<IOrganization | null> {
    return this.getCurrentOrganizationService.getCurrentOrganization();
  }
}
