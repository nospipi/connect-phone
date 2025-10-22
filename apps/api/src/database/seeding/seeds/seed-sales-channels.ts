// apps/api/src/database/seeding/seeds/seed-sales-channels.ts

import { AppDataSource } from '../../data-source';
import { SalesChannelEntity } from '../../entities/sales-channel.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { ISalesChannel } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

export async function seedSalesChannels(
  organizations: OrganizationEntity[]
): Promise<SalesChannelEntity[]> {
  const salesChannels: Partial<ISalesChannel>[] = [];

  for (const org of organizations) {
    const channelCount = faker.number.int({ min: 2, max: 4 });
    const usedNames = new Set<string>();

    for (let i = 0; i < channelCount; i++) {
      let channelName: string;
      let attempts = 0;

      do {
        const department = faker.commerce.department();
        const suffix = faker.helpers.arrayElement([
          'Store',
          'Online',
          'Mobile',
          'Retail',
          'Platform',
        ]);
        channelName = `${department} ${suffix}`;
        attempts++;

        if (attempts > 10) {
          channelName = `${department} ${suffix} ${i + 1}`;
          break;
        }
      } while (usedNames.has(channelName));

      usedNames.add(channelName);

      salesChannels.push({
        name: channelName,
        description: faker.datatype.boolean()
          ? faker.company.catchPhrase()
          : null,
        logoId: null,
        organizationId: org.id,
      });
    }
  }

  const savedChannels = await AppDataSource.manager.save(
    SalesChannelEntity,
    salesChannels
  );

  console.log(`✅ Created ${savedChannels.length} sales channels`);
  return savedChannels;
}
