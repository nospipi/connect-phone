// apps/api/src/database/seeding/seeds/seed-countries.ts

import { AppDataSource } from '../../data-source';
import { CountryEntity } from '../../entities/country.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { generateCountries } from '../factories/countries.factory';

//----------------------------------------------------------------------

export async function seedCountries(
  organizations: OrganizationEntity[]
): Promise<CountryEntity[]> {
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

  console.log(`✅ Created ${savedCountries.length} countries`);
  return savedCountries;
}
