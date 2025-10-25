// apps/api/src/resources/users/services/get-all-organizations-of-user/service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../database/entities/user.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CurrentDbUserService } from '../../../../common/services/current-db-user.service';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { UserOrganizationRole } from '../../../../database/entities/user-organization.entity';

//----------------------------------------------------------------------------

@Injectable()
export class GetAllOrganizationsOfUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserOrganizationEntity)
    private userOrgRepository: Repository<UserOrganizationEntity>,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Get all organizations that the current user belongs to WITH their role
   * Returns flattened objects with organization properties + role
   */
  async getAllOrganizationsOfCurrentUser(): Promise<
    (OrganizationEntity & { role: UserOrganizationRole })[]
  > {
    // Get current user from context
    const user = await this.currentDbUserService.getCurrentDbUser();

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    // Fetch UserOrganization entries for the user with organization relation
    const userOrganizations = await this.userOrgRepository.find({
      where: { userId: user.id },
      relations: ['organization', 'organization.logo'],
    });

    if (!userOrganizations || userOrganizations.length === 0) {
      return [];
    }

    // Return flattened objects with organization properties + role
    return userOrganizations.map((uo) => ({
      ...uo.organization,
      role: uo.role,
    }));
  }
}
