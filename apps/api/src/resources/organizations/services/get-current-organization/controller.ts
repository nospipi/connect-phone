// apps/api/src/resources/organizations/services/get-current-organization/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentOrganizationService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IOrganization } from '@connect-phone/shared-types';

@Controller('organizations')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetCurrentOrganizationController {
  constructor(
    private readonly getCurrentOrganizationService: GetCurrentOrganizationService
  ) {}

  @Get('current')
  async getCurrentOrganization(): Promise<IOrganization | null> {
    return this.getCurrentOrganizationService.getCurrentOrganization();
  }
}
