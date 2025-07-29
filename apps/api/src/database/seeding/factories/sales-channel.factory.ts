import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { SalesChannel } from '../../entities/sales-channel.entity';

define(SalesChannel, (faker: typeof Faker) => {
  const newChannel = new SalesChannel();
  newChannel.uuid = faker.datatype.uuid();
  newChannel.name = faker.commerce.department();
  newChannel.description = faker.commerce.productDescription();
  newChannel.organizationId = faker.datatype.number();
  return newChannel;
});
