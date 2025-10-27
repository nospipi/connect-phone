import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';

//-------------------------------------------------------

define(SalesChannelEntity, (faker: typeof Faker) => {
  const salesChannel = new SalesChannelEntity();
  salesChannel.name = `${faker.commerce.department()} ${faker.random.arrayElement(['Store', 'Online', 'Mobile', 'Retail'])}`;
  salesChannel.description = faker.random.boolean()
    ? faker.commerce.productDescription()
    : null;
  // organizationId will be set when creating the sales channel in the seed
  return salesChannel;
});
