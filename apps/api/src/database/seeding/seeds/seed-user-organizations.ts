// apps/api/src/database/seeding/seeds/seed-user-organizations.ts

import { Logger } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { UserOrganizationEntity } from '../../entities/user-organization.entity';
import { UserEntity } from '../../entities/user.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import {
  IUserOrganization,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

const logger = new Logger('SeedUserOrganizations');

export async function seedUserOrganizations(
  users: UserEntity[],
  organizations: OrganizationEntity[]
): Promise<UserOrganizationEntity[]> {
  const userOrgEntries: Partial<IUserOrganization>[] = [];

  for (const user of users) {
    const numOrgs = faker.number.int({ min: 1, max: 3 });
    const userOrgs = faker.helpers.arrayElements(organizations, numOrgs);

    for (const org of userOrgs) {
      userOrgEntries.push({
        userId: user.id,
        organizationId: org.id,
        role: faker.helpers.arrayElement([
          UserOrganizationRole.ADMIN,
          UserOrganizationRole.OPERATOR,
        ]),
      });
    }
  }

  const savedUserOrgs = await AppDataSource.manager.save(
    UserOrganizationEntity,
    userOrgEntries
  );

  logger.log(`✅ Created ${savedUserOrgs.length} user-organization links`);
  return savedUserOrgs;
}
