// apps/api/src/database/seeding/seeds/seed-media.ts

import { AppDataSource } from '../../data-source';
import { MediaEntity } from '../../entities/media.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { IMedia } from '@connect-phone/shared-types';
import { faker } from '@faker-js/faker';

//----------------------------------------------------------------------

export async function seedMedia(
  organizations: OrganizationEntity[]
): Promise<MediaEntity[]> {
  const mediaItems: Partial<IMedia>[] = [];

  for (const org of organizations) {
    const mediaCount = faker.number.int({ min: 5, max: 15 });

    for (let i = 0; i < mediaCount; i++) {
      mediaItems.push({
        url: faker.image.url(),
        description: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        organizationId: org.id,
      });
    }
  }

  const savedMedia = await AppDataSource.manager.save(MediaEntity, mediaItems);

  console.log(`✅ Created ${savedMedia.length} media items`);
  return savedMedia;
}
