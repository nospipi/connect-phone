// apps/api/src/resources/cms/users/services/get-all-organizations-of-user/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllOrganizationsOfUserService } from './service';
import { OrganizationEntity } from '../../../../../database/entities/organization.entity';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { NoCache } from '@/common/decorators/no-cache.decorator';

//-------------------------------------------

@Controller()
export class GetAllOrganizationsOfUserController {
  constructor(
    private readonly getAllOrganizationsOfUserService: GetAllOrganizationsOfUserService
  ) {}

  @Get('organizations')
  @NoCache()
  @UseGuards(DbUserGuard, OrganizationGuard)
  async getAllOrganizations(): Promise<
    (OrganizationEntity & { role: UserOrganizationRole })[]
  > {
    return this.getAllOrganizationsOfUserService.getAllOrganizationsOfCurrentUser();
  }

  @Get('organizations_accessed_by_user_without_current_org')
  @NoCache()
  @UseGuards(DbUserGuard) // No OrganizationGuard here
  async getAllOrganizationsAccessedByUserWithoutCurrentOrg(): Promise<
    (OrganizationEntity & { role: UserOrganizationRole })[]
  > {
    return this.getAllOrganizationsOfUserService.getAllOrganizationsOfCurrentUser();
  }
}
