// apps/api/src/resources/users/services/get-all-organizations-of-user/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllOrganizationsOfUserService } from './service';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

//-------------------------------------------

@Controller('users')
export class GetAllOrganizationsOfUserController {
  constructor(
    private readonly getAllOrganizationsOfUserService: GetAllOrganizationsOfUserService
  ) {}

  @Get('organizations')
  @UseGuards(DbUserGuard, OrganizationGuard)
  async getAllOrganizations(): Promise<
    (OrganizationEntity & { role: UserOrganizationRole })[]
  > {
    return this.getAllOrganizationsOfUserService.getAllOrganizationsOfCurrentUser();
  }

  @Get('organizations_accessed_by_user_without_current_org')
  @UseGuards(DbUserGuard) // No OrganizationGuard here
  async getAllOrganizationsAccessedByUserWithoutCurrentOrg(): Promise<
    (OrganizationEntity & { role: UserOrganizationRole })[]
  > {
    return this.getAllOrganizationsOfUserService.getAllOrganizationsOfCurrentUser();
  }
}
