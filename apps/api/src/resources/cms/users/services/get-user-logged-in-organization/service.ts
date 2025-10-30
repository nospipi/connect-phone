// apps/api/src/resources/users/services/get-user-logged-in-organization/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentDbUserService } from '../../../../../common/services/current-db-user.service';
import { IOrganization } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Injectable()
export class GetUserLoggedInOrganizationService {
  constructor(private readonly currentDbUserService: CurrentDbUserService) {}

  /**
   * Returns the logged organization with logo relation for the current user
   */
  async execute(): Promise<IOrganization | null> {
    const user = await this.currentDbUserService.getCurrentDbUser();

    if (!user) {
      throw new NotFoundException('No current user found');
    }

    return user.loggedOrganization;
  }
}
