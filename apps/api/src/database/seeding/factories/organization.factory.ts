// factories/organization.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Organization } from '../../entities/organization.entity';
import { faker } from '@faker-js/faker';

setSeederFactory(Organization, () => {
  const org = new Organization();
  org.uuid = faker.string.uuid();
  org.name = faker.company.name();
  org.slug = faker.helpers.slugify(org.name).toLowerCase();
  org.logoUrl =
    Math.random() > 0.5
      ? faker.image.urlLoremFlickr({
          category: 'business',
          width: 400,
          height: 400,
        })
      : null;
  //org.createdAt = faker.date.past();
  return org;
});
