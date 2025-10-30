// apps/api/src/resources/organizations/services/update-organization/controller.ts
import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { UpdateOrganizationService } from './service';
import { UpdateOrganizationDto } from './update-organization.dto';
import { IOrganization } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';

//------------------------------------------------------

@Controller('organizations')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class UpdateOrganizationController {
  constructor(
    private readonly updateOrganizationService: UpdateOrganizationService
  ) {}

  @Put('current')
  async updateOrganization(
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<IOrganization> {
    return this.updateOrganizationService.updateOrganization(
      updateOrganizationDto
    );
  }
}
