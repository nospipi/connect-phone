// factories/sales-channel.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { SalesChannel } from '../../entities/sales-channel.entity';
import { faker } from '@faker-js/faker';

setSeederFactory(SalesChannel, () => {
  const salesChannel = new SalesChannel();
  salesChannel.uuid = faker.string.uuid();
  salesChannel.name = `${faker.commerce.department()} ${faker.helpers.arrayElement(['Store', 'Online', 'Mobile', 'Retail'])}`;
  salesChannel.logoUrl =
    Math.random() > 0.5
      ? faker.image.urlLoremFlickr({
          category: 'business',
          width: 400,
          height: 400,
        })
      : null;
  salesChannel.description =
    Math.random() > 0.5 ? faker.commerce.productDescription() : null;
  // organizationId will be set when creating the sales channel in the seed
  return salesChannel;
});
