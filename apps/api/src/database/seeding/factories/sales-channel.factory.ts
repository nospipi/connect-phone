import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { SalesChannel } from '../../entities/sales-channel.entity';

define(SalesChannel, (faker: typeof Faker) => {
  const salesChannel = new SalesChannel();
  salesChannel.name = `${faker.commerce.department()} ${faker.random.arrayElement(['Store', 'Online', 'Mobile', 'Retail'])}`;
  salesChannel.description = faker.random.boolean()
    ? faker.commerce.productDescription()
    : null;
  // organizationId will be set when creating the sales channel in the seed
  return salesChannel;
});
