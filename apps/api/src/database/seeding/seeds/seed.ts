// apps/api/src/database/seeding/seeds/seed.ts

import { AppDataSource } from '../../data-source';
import { OrganizationEntity } from '../../entities/organization.entity';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { UserEntity } from '../../entities/user.entity';
import { UserOrganizationEntity } from '../../entities/user-organization.entity';
import { CountryEntity } from '../../entities/country.entity';
import {
  IUserOrganization,
  IOrganization,
  UserOrganizationRole,
  ISalesChannel,
  IUser,
  IUserInvitation,
} from '@connect-phone/shared-types';
import { UserInvitationEntity } from '../../entities/user-invitation.entity';
import { faker } from '@faker-js/faker';
import { generateCountries } from '../factories/countries.factory';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    await AppDataSource.query('TRUNCATE TABLE user_invitations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE user_organizations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE countries CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE audit_logs CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE organizations CASCADE;');

    const organizations: Partial<IOrganization>[] = Array.from(
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

    const users: Partial<IUser>[] = Array.from({ length: 500 }, () => {
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

    const userOrgEntries: Partial<IUserOrganization>[] = [];
    for (const user of savedUsers) {
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

    const salesChannels: Partial<ISalesChannel>[] = [];
    for (const org of savedOrgs) {
      const channelCount = faker.number.int({ min: 2, max: 4 });
      const usedNames = new Set<string>();

      for (let i = 0; i < channelCount; i++) {
        let channelName: string;
        let attempts = 0;

        do {
          const department = faker.commerce.department();
          const suffix = faker.helpers.arrayElement([
            'Store',
            'Online',
            'Mobile',
            'Retail',
            'Platform',
          ]);
          channelName = `${department} ${suffix}`;
          attempts++;

          if (attempts > 10) {
            channelName = `${department} ${suffix} ${i + 1}`;
            break;
          }
        } while (usedNames.has(channelName));

        usedNames.add(channelName);

        salesChannels.push({
          name: channelName,
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

    const countriesData = generateCountries();
    const allCountries: Partial<CountryEntity>[] = [];
    for (const org of savedOrgs) {
      const orgCountries = countriesData.map((country) => ({
        ...country,
        organizationId: org.id,
      }));
      allCountries.push(...orgCountries);
    }

    await AppDataSource.manager.save(CountryEntity, allCountries);

    const userInvitations: Partial<IUserInvitation>[] = [];
    for (const org of savedOrgs) {
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

    await AppDataSource.manager.save(UserInvitationEntity, userInvitations);

    console.log(`Seeding completed successfully!`);
    console.log(
      `Created ${savedOrgs.length} organizations, ${savedUsers.length} users, ${userOrgEntries.length} user-organization links, ${salesChannels.length} sales channels, ${allCountries.length} countries, and ${userInvitations.length} user invitations`
    );
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seed();
}
