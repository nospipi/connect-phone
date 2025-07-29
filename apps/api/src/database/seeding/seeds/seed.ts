// src/database/seeding/seeds/seed.ts
import { AppDataSource } from '../../data-source';
import { Organization } from '../../entities/organization.entity';
import { SalesChannel } from '../../entities/sales-channel.entity';
import * as faker from 'faker';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    // Clear existing data
    await AppDataSource.query('TRUNCATE TABLE sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE organizations CASCADE;');

    // Create organizations with faker
    const organizations = Array.from({ length: 5 }, () => ({
      uuid: faker.random.uuid(),
      name: faker.company.companyName(),
      slug: faker.helpers.slugify(faker.company.companyName()).toLowerCase(),
      logoUrl: faker.random.boolean()
        ? faker.image.business(400, 400, true)
        : null,
      createdAt: faker.date.past().toISOString(),
    }));

    const savedOrgs = await AppDataSource.manager.save(
      Organization,
      organizations
    );

    // Create sales channels with faker - fix typing
    const salesChannels: Partial<SalesChannel>[] = [];
    for (const org of savedOrgs) {
      // Create 2-4 sales channels per organization
      const channelCount = faker.random.number({ min: 2, max: 4 });
      for (let i = 0; i < channelCount; i++) {
        salesChannels.push({
          uuid: faker.random.uuid(),
          name: `${faker.commerce.department()} ${faker.random.arrayElement(['Store', 'Online', 'Mobile', 'Retail', 'Platform'])}`,
          description: faker.random.boolean()
            ? faker.commerce.productDescription()
            : null,
          organizationId: org.id,
        });
      }
    }

    await AppDataSource.manager.save(SalesChannel, salesChannels);

    console.log(`Seeding completed successfully!`);
    console.log(
      `Created ${organizations.length} organizations and ${salesChannels.length} sales channels`
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
