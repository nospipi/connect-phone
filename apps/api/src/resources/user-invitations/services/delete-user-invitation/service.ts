// apps/api/src/resources/user-invitations/services/delete-user-invitation/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import { IUserInvitation } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class DeleteUserInvitationService {
  constructor(
    @InjectRepository(UserInvitationEntity)
    private userInvitationRepository: Repository<UserInvitationEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Deletes a user invitation by ID for the current user's organization
   * Organization context is automatically retrieved and validated
   */
  async deleteUserInvitation(invitationId: number): Promise<IUserInvitation> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    // Find the invitation with relations to verify ownership
    const invitation = await this.userInvitationRepository.findOne({
      where: { id: invitationId },
      relations: ['organization', 'invitedBy'],
    });

    if (!invitation) {
      throw new NotFoundException(
        `User invitation with ID ${invitationId} not found`
      );
    }

    // Verify the invitation belongs to the current organization
    if (invitation.organizationId !== organization?.id) {
      throw new ForbiddenException(
        'You can only delete invitations from your own organization'
      );
    }

    // Delete the invitation
    await this.userInvitationRepository.remove(invitation);

    return invitation;
  }
}
