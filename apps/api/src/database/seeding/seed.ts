// apps/api/src/database/seeding/seeds/seed.ts

import { AppDataSource } from '../data-source';
import { seedOrganizations } from './seeds/seed-organizations';
import { seedUsers } from './seeds/seed-users';
import { seedUserOrganizations } from './seeds/seed-user-organizations';
import { seedSalesChannels } from './seeds/seed-sales-channels';
import { seedCountries } from './seeds/seed-countries';
import { seedDateRanges } from './seeds/seed-date-ranges';
import { seedPrices } from './seeds/seed-prices';
import { seedMedia } from './seeds/seed-media';
import { seedOfferInclusions } from './seeds/seed-offer-inclusions';
import { seedOfferExclusions } from './seeds/seed-offer-exclusions';
import { seedEsimOffers } from './seeds/seed-esim-offers';
import { seedUserInvitations } from './seeds/seed-user-invitations';

//----------------------------------------------------------------------

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    await AppDataSource.query('TRUNCATE TABLE esim_offer_prices CASCADE;');
    await AppDataSource.query(
      'TRUNCATE TABLE esim_offer_sales_channels CASCADE;'
    );
    await AppDataSource.query('TRUNCATE TABLE esim_offer_countries CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE esim_offer_images CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE esim_offer_exclusions CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE esim_offer_inclusions CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE esim_offers CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE offer_exclusions CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE offer_inclusions CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE media CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE price_sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE price_date_ranges CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE prices CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE date_ranges CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE user_invitations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE user_organizations CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE countries CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE audit_logs CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE organizations CASCADE;');

    const savedOrgs = await seedOrganizations();
    const savedUsers = await seedUsers(savedOrgs);
    await seedUserOrganizations(savedUsers, savedOrgs);
    await seedSalesChannels(savedOrgs);
    await seedCountries(savedOrgs);
    await seedDateRanges(savedOrgs);
    await seedPrices(savedOrgs);
    await seedMedia(savedOrgs);
    await seedOfferInclusions(savedOrgs);
    await seedOfferExclusions(savedOrgs);
    await seedEsimOffers(savedOrgs);
    await seedUserInvitations(savedOrgs, savedUsers);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seed();
}
