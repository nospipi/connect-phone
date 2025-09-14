// apps/api/src/resources/user-invitations/services/create-new-invitation/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvitation } from '../../../../database/entities/user-invitation.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

//-------------------------------------------

@Injectable()
export class CreateNewInvitationService {
  constructor(
    @InjectRepository(UserInvitation)
    private userInvitationsRepository: Repository<UserInvitation>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private currentOrganizationService: CurrentOrganizationService,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Gets the current organization and throws an error if not found
   */
  private async getCurrentOrganization(): Promise<Organization> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      const user = await this.currentDbUserService.getCurrentDbUser();
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      if (!user.loggedOrganizationId) {
        throw new UnauthorizedException(
          'User is not logged into any organization'
        );
      }
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  /**
   * Creates a new user invitation for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createNewUserInvitation(
    createUserInvitationDto: CreateUserInvitationDto
  ): Promise<UserInvitation> {
    // Automatically get the current organization from context
    const organization = await this.getCurrentOrganization();
    const currentUser = await this.currentDbUserService.getCurrentDbUser();

    const userInvitation = this.userInvitationsRepository.create({
      ...createUserInvitationDto,
      organizationId: organization.id,
      invitedById: currentUser!.id,
    });

    return this.userInvitationsRepository.save(userInvitation);
  }

  /**
   * Get all user invitations for the current user's organization
   */
  async getAllForCurrentOrganization(): Promise<UserInvitation[]> {
    // Automatically get the current organization from context
    const organization = await this.getCurrentOrganization();

    return this.userInvitationsRepository.find({
      where: { organizationId: organization.id },
      relations: ['organization', 'invitedBy'],
      order: { id: 'DESC' },
    });
  }

  /**
   * Find a specific user invitation for the current user's organization
   */
  async findOneForCurrentOrganization(id: number): Promise<UserInvitation> {
    // Automatically get the current organization from context
    const organization = await this.getCurrentOrganization();

    const userInvitation = await this.userInvitationsRepository.findOne({
      where: { id, organizationId: organization.id },
      relations: ['organization', 'invitedBy'],
    });

    if (!userInvitation) {
      throw new NotFoundException('User invitation not found');
    }

    return userInvitation;
  }

  /**
   * Update a user invitation for the current user's organization
   */
  async updateForCurrentOrganization(
    id: number,
    updateDto: Partial<CreateUserInvitationDto>
  ): Promise<UserInvitation> {
    const userInvitation = await this.findOneForCurrentOrganization(id);

    Object.assign(userInvitation, updateDto);

    return this.userInvitationsRepository.save(userInvitation);
  }

  /**
   * Delete a user invitation for the current user's organization
   */
  async removeForCurrentOrganization(id: number): Promise<void> {
    const userInvitation = await this.findOneForCurrentOrganization(id);
    await this.userInvitationsRepository.remove(userInvitation);
  }
}
