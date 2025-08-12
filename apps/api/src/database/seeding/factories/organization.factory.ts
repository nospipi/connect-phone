import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Organization } from '../../entities/organization.entity';

define(Organization, (faker: typeof Faker) => {
  const organization = new Organization();
  organization.name = faker.company.companyName();
  organization.slug = faker.helpers.slugify(organization.name).toLowerCase();
  organization.logoUrl = faker.random.boolean()
    ? faker.image.business(400, 400, true)
    : null;
  organization.createdAt = faker.date.past().toISOString();
  return organization;
});
