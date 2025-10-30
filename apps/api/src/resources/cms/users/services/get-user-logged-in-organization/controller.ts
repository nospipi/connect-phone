// src/resources/users/controllers/is-user-logged-in-organization.controller.ts
import { Controller, Get } from '@nestjs/common';
import { GetUserLoggedInOrganizationService } from './service';
import { IOrganization } from '@connect-phone/shared-types';
import { NoCache } from '@/common/decorators/no-cache.decorator';

//------------------------------------------------------

@Controller('users')
export class GetUserLoggedInOrganizationController {
  constructor(
    private readonly getUserLoggedInOrganizationService: GetUserLoggedInOrganizationService
  ) {}

  @Get('get-logged-organization')
  @NoCache()
  async getUserLoggedInOrganization(): Promise<IOrganization | null> {
    const loggedOrganization =
      await this.getUserLoggedInOrganizationService.execute();

    return loggedOrganization;
  }
}
