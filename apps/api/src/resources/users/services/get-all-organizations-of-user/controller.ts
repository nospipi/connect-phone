// apps/api/src/resources/users/services/get-all-organizations-of-user/controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllOrganizationsOfUserService } from './service';
import { Organization } from '../../../../database/entities/organization.entity';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { Public } from '../../../../common/decorators/public.decorator';

//-------------------------------------------

@Controller('users')
//@Public()
//@UseGuards(DbUserGuard)
export class GetAllOrganizationsOfUserController {
  constructor(
    private readonly getAllOrganizationsOfUserService: GetAllOrganizationsOfUserService
  ) {}

  @Get('organizations')
  async getAllOrganizations(): Promise<Organization[]> {
    return this.getAllOrganizationsOfUserService.getAllOrganizationsOfCurrentUser();
  }
}
