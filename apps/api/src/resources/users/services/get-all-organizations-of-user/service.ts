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

//-------------------------------------------

@Injectable()
export class GetAllOrganizationsOfUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Get all organizations that the current user belongs to
   * Uses CurrentDbUserService to get the user - no input required from caller
   */
  async getAllOrganizationsOfCurrentUser(): Promise<Organization[]> {
    // Get current user from context
    const user = await this.currentDbUserService.getCurrentDbUser();

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    console.log(
      `Getting organizations for user: ${user.email} (ID: ${user.id})`
    );

    // Fetch user with organizations relationship
    const userWithOrganizations = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['organizations'],
    });

    if (!userWithOrganizations) {
      throw new NotFoundException('User not found');
    }

    console.log(
      `Found ${userWithOrganizations.organizations.length} organizations for user ${user.email}`
    );

    return userWithOrganizations.organizations;
  }
}
