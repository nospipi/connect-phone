// src/database/seeding/seeds/seed.ts
import { AppDataSource } from '../../data-source';
import { OrganizationEntity } from '../../entities/organization.entity';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { UserEntity } from '../../entities/user.entity';
import { UserOrganizationEntity } from '../../entities/user-organization.entity';
import {
  IUserOrganization,
  UserOrganizationRole,
  ISalesChannel,
} from '@connect-phone/shared-types';
import {
  UserInvitationEntity,
  InvitationStatus,
} from '../../entities/user-invitation.entity';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    // Clear existing data (order matters)
    await AppDataSource.query('TRUNCATE TABLE user_invitations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE user_organizations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE audit_logs CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE organizations CASCADE;');

    // Create organizations
    const organizations: Partial<OrganizationEntity>[] = Array.from(
      { length: 5 },
      () => {
        const name = faker.company.name();
        return {
          name,
          slug: faker.helpers.slugify(name).toLowerCase(),
          logoUrl: faker.datatype.boolean()
            ? 'https://picsum.photos/400/400'
            : null,
        };
      }
    );

    const savedOrgs = await AppDataSource.manager.save(
      OrganizationEntity,
      organizations
    );

    // Create users
    const users: Partial<UserEntity>[] = Array.from({ length: 500 }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        email: faker.internet.email({
          firstName,
          lastName,
          provider: 'example.com',
        }),
        firstName,
        lastName,
        loggedOrganizationId: faker.datatype.boolean()
          ? faker.helpers.arrayElement(savedOrgs)?.id
          : null,
      };
    });

    const savedUsers = await AppDataSource.manager.save(UserEntity, users);

    // Create UserOrganization relationships
    const userOrgEntries: Partial<IUserOrganization>[] = [];
    for (const user of savedUsers) {
      // Each user belongs to 1-3 random organizations
      const numOrgs = faker.number.int({ min: 1, max: 3 });
      const userOrgs = faker.helpers.arrayElements(savedOrgs, numOrgs);

      for (const org of userOrgs) {
        userOrgEntries.push({
          userId: user.id,
          organizationId: org.id,
          role: faker.helpers.arrayElement([
            UserOrganizationRole.ADMIN,
            UserOrganizationRole.OPERATOR,
          ]),
        });
      }
    }

    await AppDataSource.manager.save(UserOrganizationEntity, userOrgEntries);

    // Create sales channels
    const salesChannels: Partial<ISalesChannel>[] = [];
    for (const org of savedOrgs) {
      const channelCount = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < channelCount; i++) {
        salesChannels.push({
          name: `${faker.commerce.department()} ${faker.helpers.arrayElement([
            'Store',
            'Online',
            'Mobile',
            'Retail',
            'Platform',
          ])}`,
          description: faker.datatype.boolean()
            ? faker.company.catchPhrase()
            : null,
          logoUrl: faker.datatype.boolean()
            ? 'https://picsum.photos/400/400'
            : null,
          organizationId: org.id,
        });
      }
    }

    await AppDataSource.manager.save(SalesChannelEntity, salesChannels);

    // Create user invitations
    const userInvitations: Partial<UserInvitationEntity>[] = [];
    for (const org of savedOrgs) {
      // Get users that belong to this organization to use as "invited by"
      const orgUsers = userOrgEntries
        .filter((uo) => uo.organizationId === org.id)
        .map((uo) => savedUsers.find((user) => user.id === uo.userId))
        .filter(Boolean);

      if (orgUsers.length > 0) {
        const invitationCount = faker.number.int({ min: 2, max: 6 });
        for (let i = 0; i < invitationCount; i++) {
          const invitedBy = faker.helpers.arrayElement(orgUsers);
          userInvitations.push({
            email: faker.internet.email({
              provider: 'invitation.com',
            }),
            status: faker.helpers.arrayElement([
              InvitationStatus.PENDING,
              InvitationStatus.ACCEPTED,
              InvitationStatus.REJECTED,
            ]),
            organizationId: org.id,
            invitedById: invitedBy!.id,
          });
        }
      }
    }

    await AppDataSource.manager.save(UserInvitationEntity, userInvitations);

    console.log(`Seeding completed successfully!`);
    console.log(
      `Created ${savedOrgs.length} organizations, ${savedUsers.length} users, ${userOrgEntries.length} user-organization links, ${salesChannels.length} sales channels, and ${userInvitations.length} user invitations`
    );
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}
