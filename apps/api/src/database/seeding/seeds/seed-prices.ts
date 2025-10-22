// apps/api/src/database/seeding/seeds/seed-prices.ts

import { AppDataSource } from '../../data-source';
import { PriceEntity } from '../../entities/price.entity';
import { DateRangeEntity } from '../../entities/date-range.entity';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { generatePrices } from '../factories/price.factory';

//----------------------------------------------------------------------

export async function seedPrices(
  organizations: OrganizationEntity[]
): Promise<PriceEntity[]> {
  const pricesData = generatePrices();
  const allPrices: Partial<PriceEntity>[] = [];

  for (const org of organizations) {
    const orgPrices = pricesData.map((price) => ({
      ...price,
      organizationId: org.id,
    }));
    allPrices.push(...orgPrices);
  }

  const savedPrices = await AppDataSource.manager.save(PriceEntity, allPrices);

  const priceRepository = AppDataSource.getRepository(PriceEntity);
  const dateRanges = await AppDataSource.manager.find(DateRangeEntity);

  for (const price of savedPrices) {
    if (price.isDateBased) {
      const orgDateRanges = dateRanges.filter(
        (dr) => dr.organizationId === price.organizationId
      );

      await priceRepository
        .createQueryBuilder()
        .relation(PriceEntity, 'dateRanges')
        .of(price)
        .add(orgDateRanges);
    }

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

  console.log(`✅ Created ${savedPrices.length} prices`);
  return savedPrices;
}
