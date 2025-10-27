// apps/api/src/database/seeding/seeds/seed-users.ts

import { Logger } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { UserEntity } from '../../entities/user.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { IUser } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

const logger = new Logger('SeedUsers');

export async function seedUsers(
  organizations: OrganizationEntity[]
): Promise<UserEntity[]> {
  const users: Partial<IUser>[] = Array.from({ length: 500 }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      email: faker.internet.email({
        firstName,
        lastName,
        provider: 'example.com',
      }),
      firstName,
      lastName,
      loggedOrganizationId: faker.datatype.boolean()
        ? faker.helpers.arrayElement(organizations)?.id
        : null,
    };
  });

  const savedUsers = await AppDataSource.manager.save(UserEntity, users);

  logger.log(`✅ Created ${savedUsers.length} users`);
  return savedUsers;
}
