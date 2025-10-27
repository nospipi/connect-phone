// apps/api/src/database/seeding/seeds/seed-esim-offers.ts

import { Logger } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { EsimOfferEntity } from '../../entities/esim-offer.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { MediaEntity } from '../../entities/media.entity';
import { CountryEntity } from '../../entities/country.entity';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { PriceEntity } from '../../entities/price.entity';
import { OfferInclusionEntity } from '../../entities/offer-inclusion.entity';
import { OfferExclusionEntity } from '../../entities/offer-exclusion.entity';
import { IEsimOffer } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

const logger = new Logger('SeedEsimOffers');

export async function seedEsimOffers(
  organizations: OrganizationEntity[]
): Promise<EsimOfferEntity[]> {
  const offers: Partial<IEsimOffer>[] = [];

  for (const org of organizations) {
    const offerCount = faker.number.int({ min: 5, max: 15 });

    for (let i = 0; i < offerCount; i++) {
      const title = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const isUnlimitedData = faker.datatype.boolean();

      offers.push({
        title,
        descriptionHtml: `<p>${description}</p>`,
        descriptionText: description,
        durationInDays: faker.helpers.arrayElement([7, 14, 30, 60, 90]),
        dataInGb: isUnlimitedData
          ? null
          : faker.number.float({ min: 1, max: 50 }),
        isUnlimitedData,
        organizationId: org.id,
        mainImageId: null,
      });
    }
  }

  const savedOffers = await AppDataSource.manager.save(EsimOfferEntity, offers);

  const offerRepository = AppDataSource.getRepository(EsimOfferEntity);

  for (const offer of savedOffers) {
    const media = await AppDataSource.manager.find(MediaEntity, {
      where: { organizationId: offer.organizationId },
      take: 5,
    });

    const countries = await AppDataSource.manager.find(CountryEntity, {
      where: { organizationId: offer.organizationId },
      take: faker.number.int({ min: 3, max: 10 }),
    });

    const salesChannels = await AppDataSource.manager.find(SalesChannelEntity, {
      where: { organizationId: offer.organizationId },
      take: 2,
    });

    const prices = await AppDataSource.manager.find(PriceEntity, {
      where: { organizationId: offer.organizationId },
      take: faker.number.int({ min: 1, max: 3 }),
    });

    const inclusions = await AppDataSource.manager.find(OfferInclusionEntity, {
      where: { organizationId: offer.organizationId },
      take: faker.number.int({ min: 2, max: 5 }),
    });

    const exclusions = await AppDataSource.manager.find(OfferExclusionEntity, {
      where: { organizationId: offer.organizationId },
      take: faker.number.int({ min: 2, max: 5 }),
    });

    if (media.length > 0) {
      await offerRepository
        .createQueryBuilder()
        .relation(EsimOfferEntity, 'images')
        .of(offer)
        .add(media);
    }

    if (countries.length > 0) {
      await offerRepository
        .createQueryBuilder()
        .relation(EsimOfferEntity, 'countries')
        .of(offer)
        .add(countries);
    }

    if (salesChannels.length > 0) {
      await offerRepository
        .createQueryBuilder()
        .relation(EsimOfferEntity, 'salesChannels')
        .of(offer)
        .add(salesChannels);
    }

    if (prices.length > 0) {
      await offerRepository
        .createQueryBuilder()
        .relation(EsimOfferEntity, 'prices')
        .of(offer)
        .add(prices);
    }

    if (inclusions.length > 0) {
      await offerRepository
        .createQueryBuilder()
        .relation(EsimOfferEntity, 'inclusions')
        .of(offer)
        .add(inclusions);
    }

    if (exclusions.length > 0) {
      await offerRepository
        .createQueryBuilder()
        .relation(EsimOfferEntity, 'exclusions')
        .of(offer)
        .add(exclusions);
    }
  }

  logger.log(`✅ Created ${savedOffers.length} eSIM offers`);
  return savedOffers;
}
