// apps/api/src/database/seeding/seeds/seed-user-invitations.ts

import { AppDataSource } from '../../data-source';
import { UserInvitationEntity } from '../../entities/user-invitation.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { UserEntity } from '../../entities/user.entity';
import { UserOrganizationEntity } from '../../entities/user-organization.entity';
import {
  IUserInvitation,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

export async function seedUserInvitations(
  organizations: OrganizationEntity[],
  users: UserEntity[]
): Promise<UserInvitationEntity[]> {
  const userInvitations: Partial<IUserInvitation>[] = [];

  for (const org of organizations) {
    const userOrgEntries = await AppDataSource.manager.find(
      UserOrganizationEntity,
      {
        where: { organizationId: org.id },
      }
    );

    const orgUsers = userOrgEntries
      .map((uo) => users.find((user) => user.id === uo.userId))
      .filter(Boolean);

    if (orgUsers.length > 0) {
      const invitationCount = faker.number.int({ min: 2, max: 6 });

      for (let i = 0; i < invitationCount; i++) {
        const invitedBy = faker.helpers.arrayElement(orgUsers);
        userInvitations.push({
          email: faker.internet.email({
            provider: 'invitation.com',
          }),
          role: faker.helpers.arrayElement([
            UserOrganizationRole.ADMIN,
            UserOrganizationRole.OPERATOR,
          ]),
          organizationId: org.id,
          invitedById: invitedBy!.id,
        });
      }
    }
  }

  const savedInvitations = await AppDataSource.manager.save(
    UserInvitationEntity,
    userInvitations
  );

  console.log(`✅ Created ${savedInvitations.length} user invitations`);
  return savedInvitations;
}
