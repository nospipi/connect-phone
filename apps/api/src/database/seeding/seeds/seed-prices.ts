// apps/api/src/database/seeding/seeds/seed-prices.ts

import { AppDataSource } from '../../data-source';
import { PriceEntity } from '../../entities/price.entity';
import { DateRangeEntity } from '../../entities/date-range.entity';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { generatePrices } from '../factories/price.factory';
import { generateDateRanges } from '../factories/date-range.factory';

export async function seedPrices() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding prices');

    await AppDataSource.query('TRUNCATE TABLE price_sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE price_date_ranges CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE prices CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE date_ranges CASCADE;');
    console.log('Cleared existing prices and date ranges');

    const organizations = await AppDataSource.manager.find(OrganizationEntity);

    if (organizations.length === 0) {
      console.log('No organizations found. Please seed organizations first.');
      return;
    }

    console.log('Seeding date ranges...');
    const dateRangesData = generateDateRanges();
    const allDateRanges: Partial<DateRangeEntity>[] = [];

    for (const org of organizations) {
      const orgDateRanges = dateRangesData.map((dateRange) => ({
        ...dateRange,
        organizationId: org.id,
      }));
      allDateRanges.push(...orgDateRanges);
    }

    const savedDateRanges = await AppDataSource.manager.save(
      DateRangeEntity,
      allDateRanges
    );
    console.log(`Created ${savedDateRanges.length} date ranges`);

    console.log('Seeding prices...');
    const pricesData = generatePrices();
    const allPrices: Partial<PriceEntity>[] = [];

    for (const org of organizations) {
      const orgPrices = pricesData.map((price) => ({
        ...price,
        organizationId: org.id,
      }));
      allPrices.push(...orgPrices);
    }

    const savedPrices = await AppDataSource.manager.save(
      PriceEntity,
      allPrices
    );
    console.log(`Created ${savedPrices.length} prices`);

    console.log('Linking date-based prices to date ranges...');
    const priceRepository = AppDataSource.getRepository(PriceEntity);

    for (const price of savedPrices) {
      if (price.isDateBased) {
        const orgDateRanges = savedDateRanges.filter(
          (dr) => dr.organizationId === price.organizationId
        );

        await priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'dateRanges')
          .of(price)
          .add(orgDateRanges);
      }
    }

    console.log('Linking prices to sales channels...');

    for (const price of savedPrices) {
      const orgSalesChannels = await AppDataSource.manager.find(
        SalesChannelEntity,
        {
          where: { organizationId: price.organizationId },
          take: 2,
        }
      );

      if (orgSalesChannels.length > 0) {
        await priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'salesChannels')
          .of(price)
          .add(orgSalesChannels);
      }
    }

    console.log(
      `✅ Successfully seeded ${savedPrices.length} prices with ${savedDateRanges.length} date ranges across ${organizations.length} organizations`
    );
  } catch (error) {
    console.error('Seeding prices failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seedPrices();
}
