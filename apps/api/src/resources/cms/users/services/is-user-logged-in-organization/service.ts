// src/resources/users/services/is-user-logged-in-organization/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentDbUserService } from '../../../../../common/services/current-db-user.service';

//------------------------------------------------------

@Injectable()
export class IsUserLoggedInOrganizationService {
  constructor(private readonly currentDbUserService: CurrentDbUserService) {}

  /**
   * Returns true if the current user has a logged organization
   */
  async execute(): Promise<boolean> {
    const user = await this.currentDbUserService.getCurrentDbUser();

    if (!user) {
      throw new NotFoundException('No current user found');
    }

    return !!user.loggedOrganizationId;
  }
}
