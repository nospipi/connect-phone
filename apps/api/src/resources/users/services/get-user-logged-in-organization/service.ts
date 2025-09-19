// src/resources/users/services/is-user-logged-in-organization/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { IOrganization } from '@connect-phone/shared-types';

@Injectable()
export class GetUserLoggedInOrganizationService {
  constructor(private readonly currentDbUserService: CurrentDbUserService) {}

  /**
   * Returns true if the current user has a logged organization
   */
  async execute(): Promise<IOrganization | null> {
    const user = await this.currentDbUserService.getCurrentDbUser();

    if (!user) {
      throw new NotFoundException('No current user found');
    }

    return user.loggedOrganization;
  }
}
