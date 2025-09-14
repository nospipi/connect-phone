// apps/api/src/resources/users/services/get-all-organizations-of-user/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllOrganizationsOfUserService } from './service';
import { Organization } from '../../../../database/entities/organization.entity';
import { UserOrganizationRole } from '../../../../database/entities/user-organization.entity';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { Public } from '../../../../common/decorators/public.decorator';

//-------------------------------------------

@Controller('users')
@UseGuards(DbUserGuard, OrganizationGuard)
//@Public()
//@UseGuards(DbUserGuard)
export class GetAllOrganizationsOfUserController {
  constructor(
    private readonly getAllOrganizationsOfUserService: GetAllOrganizationsOfUserService
  ) {}

  @Get('organizations')
  async getAllOrganizations(): Promise<
    (Organization & { role: UserOrganizationRole })[]
  > {
    return this.getAllOrganizationsOfUserService.getAllOrganizationsOfCurrentUser();
  }
}
