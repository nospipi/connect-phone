// src/resources/users/controllers/is-user-logged-in-organization.controller.ts
import { Controller, Get } from '@nestjs/common';
import { GetUserLoggedInOrganizationService } from './service';
import { Organization } from '../../../../database/entities/organization.entity';

@Controller('users')
export class GetUserLoggedInOrganizationController {
  constructor(
    private readonly getUserLoggedInOrganizationService: GetUserLoggedInOrganizationService
  ) {}

  @Get('get-logged-organization')
  async getUserLoggedInOrganization(): Promise<Organization | null> {
    const loggedOrganization =
      await this.getUserLoggedInOrganizationService.execute();

    return loggedOrganization;
  }
}
