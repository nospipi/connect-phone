// apps/api/src/resources/users/services/delete-user/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { IUser } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class DeleteUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserOrganizationEntity)
    private userOrganizationRepository: Repository<UserOrganizationEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Deletes a user by ID from the current user's organization
   * Organization context is automatically retrieved and validated
   */
  async deleteUserById(userId: number): Promise<IUser> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    // First verify the user belongs to the current organization
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: {
        userId: userId,
        organizationId: organization.id,
      },
      relations: ['user', 'user.loggedOrganization', 'user.userOrganizations'],
    });

    if (!userOrganization) {
      throw new NotFoundException(
        `User with ID ${userId} not found in current organization`
      );
    }

    if (!userOrganization.user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get the user with full relations for return value
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'loggedOrganization',
        'userOrganizations',
        'userOrganizations.organization',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Delete the user (cascade deletes will handle UserOrganization relationships)
    await this.userRepository.remove(user);

    return user;
  }
}
