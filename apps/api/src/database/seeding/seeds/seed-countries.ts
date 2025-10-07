// apps/api/src/database/seeding/seeds/seed-countries.ts
import { AppDataSource } from '../../data-source';
import { CountryEntity } from '../../entities/country.entity';
import { generateCountries } from '../factories/countries.factory';

async function seedCountries() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding countries');

    // Clear existing countries
    await AppDataSource.query('TRUNCATE TABLE countries CASCADE;');
    console.log('Cleared existing countries');

    // Seed countries
    console.log('Seeding countries...');
    const countries = generateCountries();
    const savedCountries = await AppDataSource.manager.save(
      CountryEntity,
      countries
    );
    console.log(`✅ Successfully seeded ${savedCountries.length} countries`);
  } catch (error) {
    console.error('Seeding countries failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seedCountries();
}
