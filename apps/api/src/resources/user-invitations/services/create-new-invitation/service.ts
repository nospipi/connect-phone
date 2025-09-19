// apps/api/src/resources/user-invitations/services/create-new-invitation/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { IUserInvitation } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class CreateNewInvitationService {
  constructor(
    @InjectRepository(UserInvitationEntity)
    private userInvitationsRepository: Repository<UserInvitationEntity>,
    @InjectRepository(OrganizationEntity)
    private organizationsRepository: Repository<OrganizationEntity>,
    private currentOrganizationService: CurrentOrganizationService,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Creates a new user invitation for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createNewUserInvitation(
    createUserInvitationDto: CreateUserInvitationDto
  ): Promise<IUserInvitation> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();
    const currentUser = await this.currentDbUserService.getCurrentDbUser();

    const userInvitation = this.userInvitationsRepository.create({
      ...createUserInvitationDto,
      organizationId: organization?.id,
      invitedById: currentUser!.id,
    });

    return this.userInvitationsRepository.save(userInvitation);
  }

  /**
   * Get all user invitations for the current user's organization
   */
  async getAllForCurrentOrganization(): Promise<IUserInvitation[]> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.userInvitationsRepository.find({
      where: { organizationId: organization?.id },
      relations: ['organization', 'invitedBy'],
      order: { id: 'DESC' },
    });
  }

  /**
   * Find a specific user invitation for the current user's organization
   */
  async findOneForCurrentOrganization(id: number): Promise<IUserInvitation> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const userInvitation = await this.userInvitationsRepository.findOne({
      where: { id, organizationId: organization?.id },
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
  ): Promise<IUserInvitation> {
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
