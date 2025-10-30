// apps/api/src/resources/cms/users/services/is-user-logged-in-organization/controller.ts
import { Controller, Get } from '@nestjs/common';
import { IsUserLoggedInOrganizationService } from './service';
import { NoCache } from '@/common/decorators/no-cache.decorator';

//------------------------------------------------------

@Controller()
export class IsUserLoggedInOrganizationController {
  constructor(
    private readonly isUserLoggedInOrganizationService: IsUserLoggedInOrganizationService
  ) {}

  /**
   * GET /users/logged-organization
   * Returns true if the current user has a logged organization, false otherwise
   */
  @Get('logged-organization')
  @NoCache()
  async isLoggedIn(): Promise<{ loggedIn: boolean }> {
    const loggedIn = await this.isUserLoggedInOrganizationService.execute();
    console.log(`User logged in organization status: ${loggedIn}`);
    return { loggedIn };
  }
}
