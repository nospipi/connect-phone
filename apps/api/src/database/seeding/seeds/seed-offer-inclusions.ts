// apps/api/src/database/seeding/seeds/seed-offer-inclusions.ts

import { Logger } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { OfferInclusionEntity } from '../../entities/offer-inclusion.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

const logger = new Logger('SeedOfferInclusions');

export async function seedOfferInclusions(
  organizations: OrganizationEntity[]
): Promise<OfferInclusionEntity[]> {
  const inclusions: Partial<IOfferInclusion>[] = [];

  for (const org of organizations) {
    const inclusionCount = faker.number.int({ min: 3, max: 8 });

    for (let i = 0; i < inclusionCount; i++) {
      inclusions.push({
        body: faker.lorem.sentence(),
        organizationId: org.id,
      });
    }
  }

  const savedInclusions = await AppDataSource.manager.save(
    OfferInclusionEntity,
    inclusions
  );

  logger.log(`✅ Created ${savedInclusions.length} offer inclusions`);
  return savedInclusions;
}
