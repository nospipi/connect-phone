// apps/api/src/database/seeding/seeds/seed-countries.ts

import { AppDataSource } from '../../data-source';
import { CountryEntity } from '../../entities/country.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { generateCountries } from '../factories/countries.factory';

async function seedCountries() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding countries');

    await AppDataSource.query('TRUNCATE TABLE countries CASCADE;');
    console.log('Cleared existing countries');

    const organizations = await AppDataSource.manager.find(OrganizationEntity);

    if (organizations.length === 0) {
      console.log('No organizations found. Please seed organizations first.');
      return;
    }

    console.log('Seeding countries...');
    const countriesData = generateCountries();

    const allCountries: Partial<CountryEntity>[] = [];
    for (const org of organizations) {
      const orgCountries = countriesData.map((country) => ({
        ...country,
        organizationId: org.id,
      }));
      allCountries.push(...orgCountries);
    }

    const savedCountries = await AppDataSource.manager.save(
      CountryEntity,
      allCountries
    );
    console.log(
      `✅ Successfully seeded ${savedCountries.length} countries across ${organizations.length} organizations`
    );
  } catch (error) {
    console.error('Seeding countries failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seedCountries();
}
