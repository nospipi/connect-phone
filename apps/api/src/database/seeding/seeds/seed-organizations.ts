// apps/api/src/database/seeding/seeds/seed-organizations.ts

import { AppDataSource } from '../../data-source';
import { OrganizationEntity } from '../../entities/organization.entity';
import { IOrganization } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

export async function seedOrganizations(): Promise<OrganizationEntity[]> {
  const organizations: Partial<IOrganization>[] = Array.from(
    { length: 5 },
    () => {
      const name = faker.company.name();
      return {
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        logoId: null,
      };
    }
  );

  const savedOrgs = await AppDataSource.manager.save(
    OrganizationEntity,
    organizations
  );

  console.log(`✅ Created ${savedOrgs.length} organizations`);
  return savedOrgs;
}
