// apps/api/src/resources/users/services/get-user-by-id/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../../database/entities/user-organization.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import { IUserWithOrganizationRole } from '@connect-phone/shared-types';

//----------------------------------------------------------------------------

@Injectable()
export class GetUserByIdService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserOrganizationEntity)
    private userOrganizationRepository: Repository<UserOrganizationEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getUserById(userId: number): Promise<IUserWithOrganizationRole> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    // Get the user-organization relationship (includes role)
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: {
        userId: userId,
        organizationId: organization.id,
      },
      relations: [
        'user',
        'user.loggedOrganization',
        'user.userOrganizations',
        'user.userOrganizations.organization',
      ],
    });

    if (!userOrganization) {
      throw new NotFoundException(
        `User with ID ${userId} not found in current organization`
      );
    }

    if (!userOrganization.user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Return user with role
    return {
      ...userOrganization.user,
      role: userOrganization.role,
    };
  }
}
