// apps/api/src/database/seeding/seeds/seed-offer-exclusions.ts

import { AppDataSource } from '../../data-source';
import { OfferExclusionEntity } from '../../entities/offer-exclusion.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

export async function seedOfferExclusions(
  organizations: OrganizationEntity[]
): Promise<OfferExclusionEntity[]> {
  const exclusions: Partial<IOfferExclusion>[] = [];

  for (const org of organizations) {
    const exclusionCount = faker.number.int({ min: 3, max: 8 });

    for (let i = 0; i < exclusionCount; i++) {
      exclusions.push({
        body: faker.lorem.sentence(),
        organizationId: org.id,
      });
    }
  }

  const savedExclusions = await AppDataSource.manager.save(
    OfferExclusionEntity,
    exclusions
  );

  console.log(`✅ Created ${savedExclusions.length} offer exclusions`);
  return savedExclusions;
}
