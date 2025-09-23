// src/database/subscribers/user-invitation.subscriber.ts
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { UserInvitationEntity } from '../entities/user-invitation.entity';
import { UserEntity } from '../entities/user.entity';
import { UserOrganizationEntity } from '../entities/user-organization.entity';

@EventSubscriber()
export class UserInvitationSubscriber
  implements EntitySubscriberInterface<UserInvitationEntity>
{
  listenTo() {
    return UserInvitationEntity;
  }

  async beforeInsert(event: InsertEvent<UserInvitationEntity>): Promise<void> {
    const invitation = event.entity;

    console.log(
      `🔍 Validating invitation for email: ${invitation.email} in organization: ${invitation.organizationId}`
    );

    // First check: Does an invitation already exist for this email and organization?
    const existingInvitation = await event.manager
      .getRepository(UserInvitationEntity)
      .findOne({
        where: {
          email: invitation.email,
          organizationId: invitation.organizationId,
        },
      });

    if (existingInvitation) {
      console.log(
        `❌ Invitation already exists for ${invitation.email} in organization ${invitation.organizationId}. Blocking duplicate invitation.`
      );
      throw new ConflictException(
        `An invitation has already been sent to ${invitation.email} for this organization.`
      );
    }

    // Second check: Does a user with this email already exist?
    const existingUser = await event.manager.getRepository(UserEntity).findOne({
      where: { email: invitation.email },
    });

    // If no user exists, invitation is allowed (no duplicate invitation found)
    if (!existingUser) {
      console.log(
        `✅ No existing user found with email: ${invitation.email}. Invitation allowed.`
      );
      return;
    }

    console.log(
      `👤 Found existing user with email: ${invitation.email} (ID: ${existingUser.id})`
    );

    // Third check: Is this user already part of the target organization?
    const userOrganizationExists = await event.manager
      .getRepository(UserOrganizationEntity)
      .findOne({
        where: {
          userId: existingUser.id,
          organizationId: invitation.organizationId,
        },
      });

    // If user is already in the organization, prevent the invitation
    if (userOrganizationExists) {
      console.log(
        `❌ User ${invitation.email} is already in organization ${invitation.organizationId}. Blocking invitation.`
      );
      throw new ConflictException(
        `User with email ${invitation.email} is already a member of this organization. No invitation needed.`
      );
    }

    console.log(
      `✅ User ${invitation.email} exists but not in organization ${invitation.organizationId}. Invitation allowed.`
    );
  }
}
