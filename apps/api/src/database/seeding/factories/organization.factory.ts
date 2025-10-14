// apps/api/src/database/seeding/factories/organization.factory.ts
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { OrganizationEntity } from '../../entities/organization.entity';

//----------------------------------------------------------------------

define(OrganizationEntity, (faker: typeof Faker) => {
  const organization = new OrganizationEntity();
  organization.name = faker.company.companyName();
  organization.slug = faker.helpers.slugify(organization.name).toLowerCase();
  organization.logoId = null;
  organization.createdAt = faker.date.past().toISOString();
  return organization;
});
