// src/resources/users/controllers/is-user-logged-in-organization.controller.ts
import { Controller, Get } from '@nestjs/common';
import { GetUserLoggedInOrganizationService } from './service';

@Controller('users')
export class GetUserLoggedInOrganizationController {
  constructor(
    private readonly getUserLoggedInOrganizationService: GetUserLoggedInOrganizationService
  ) {}

  /**
   * GET /users/logged-organization
   * Returns true if the current user has a logged organization, false otherwise
   */
  @Get('get-logged-organization')
  async getUserLoggedInOrganization(): Promise<number | null> {
    const loggedOrganizationId =
      await this.getUserLoggedInOrganizationService.execute();

    return loggedOrganizationId;
  }
}
