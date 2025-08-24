// src/database/seeding/seeds/seed.ts
import { AppDataSource } from '../../data-source';
import { Organization } from '../../entities/organization.entity';
import { SalesChannel } from '../../entities/sales-channel.entity';
import { User } from '../../entities/user.entity';
import {
  UserOrganization,
  UserOrganizationRole,
} from '../../entities/user-organization.entity';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    // Clear existing data (order matters)
    await AppDataSource.query('TRUNCATE TABLE user_organizations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE organizations CASCADE;');

    // Create organizations
    const organizations: Partial<Organization>[] = Array.from(
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
      Organization,
      organizations
    );

    // Create users
    const users: Partial<User>[] = Array.from({ length: 15 }, () => {
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

    const savedUsers = await AppDataSource.manager.save(User, users);

    // Create UserOrganization relationships
    const userOrgEntries: Partial<UserOrganization>[] = [];
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

    await AppDataSource.manager.save(UserOrganization, userOrgEntries);

    // Create sales channels
    const salesChannels: Partial<SalesChannel>[] = [];
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

    await AppDataSource.manager.save(SalesChannel, salesChannels);

    console.log(`Seeding completed successfully!`);
    console.log(
      `Created ${savedOrgs.length} organizations, ${savedUsers.length} users, ${userOrgEntries.length} user-organization links, and ${salesChannels.length} sales channels`
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
