// src/database/seeding/seeds/seed.ts
import { AppDataSource } from '../../data-source';
import { Organization } from '../../entities/organization.entity';
import { SalesChannel } from '../../entities/sales-channel.entity';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    // Clear existing data
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(SalesChannel)
      .execute();

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Organization)
      .execute();

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
          organization: org, // relation instead of organizationId
        });
      }
    }

    await AppDataSource.manager.save(SalesChannel, salesChannels);

    console.log(`Seeding completed successfully!`);
    console.log(
      `Created ${savedOrgs.length} organizations and ${salesChannels.length} sales channels`
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
