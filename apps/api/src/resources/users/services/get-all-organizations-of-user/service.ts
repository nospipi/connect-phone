// apps/api/src/resources/users/services/get-all-organizations-of-user/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../database/entities/user.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import {
  UserOrganization,
  UserOrganizationRole,
} from '../../../../database/entities/user-organization.entity';

@Injectable()
export class GetAllOrganizationsOfUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserOrganization)
    private userOrgRepository: Repository<UserOrganization>,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Get all organizations that the current user belongs to WITH their role
   * Returns flattened objects with organization properties + role
   */
  async getAllOrganizationsOfCurrentUser(): Promise<
    (Organization & { role: UserOrganizationRole })[]
  > {
    // Get current user from context
    const user = await this.currentDbUserService.getCurrentDbUser();

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    console.log(
      `Getting organizations for user: ${user.email} (ID: ${user.id})`
    );

    // Fetch UserOrganization entries for the user with organization relation
    const userOrganizations = await this.userOrgRepository.find({
      where: { userId: user.id },
      relations: ['organization'],
    });

    if (!userOrganizations || userOrganizations.length === 0) {
      console.log(`No organizations found for user ${user.email}`);
      return [];
    }

    console.log(
      `Found ${userOrganizations.length} organizations for user ${user.email}`
    );

    // Return flattened objects with organization properties + role
    return userOrganizations.map((uo) => ({
      ...uo.organization,
      role: uo.role,
    }));
  }
}
