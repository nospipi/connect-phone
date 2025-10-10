// apps/api/src/database/seeding/seeds/seed-prices.ts

import { AppDataSource } from '../../data-source';
import { PriceEntity } from '../../entities/price.entity';
import { DateRangeEntity } from '../../entities/date-range.entity';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { generatePrices } from '../factories/price.factory';
import { generateDateRanges } from '../factories/date-range.factory';

//----------------------------------------------------------------------------

async function seedPrices() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding prices');

    await AppDataSource.query('TRUNCATE TABLE price_sales_channels CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE price_date_ranges CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE prices CASCADE;');
    await AppDataSource.query('TRUNCATE TABLE date_ranges CASCADE;');
    console.log('Cleared existing prices and date ranges');

    console.log('Seeding date ranges...');
    const dateRangesData = generateDateRanges();
    const savedDateRanges = await AppDataSource.manager.save(
      DateRangeEntity,
      dateRangesData
    );
    console.log(`Created ${savedDateRanges.length} date ranges`);

    console.log('Seeding prices...');
    const pricesData = generatePrices();
    const savedPrices = await AppDataSource.manager.save(
      PriceEntity,
      pricesData
    );
    console.log(`Created ${savedPrices.length} prices`);

    console.log('Linking date-based prices to date ranges...');
    const priceRepository = AppDataSource.getRepository(PriceEntity);

    for (const price of savedPrices) {
      if (price.isDateBased) {
        await priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'dateRanges')
          .of(price)
          .add(savedDateRanges);
      }
    }

    console.log('Linking prices to sales channels...');
    const salesChannels = await AppDataSource.manager.find(SalesChannelEntity, {
      take: 3,
    });

    if (salesChannels.length > 0) {
      for (const price of savedPrices) {
        await priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'salesChannels')
          .of(price)
          .add(salesChannels);
      }
      console.log(`Linked prices to ${salesChannels.length} sales channels`);
    }

    console.log(
      `✅ Successfully seeded ${savedPrices.length} prices with ${savedDateRanges.length} date ranges`
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
