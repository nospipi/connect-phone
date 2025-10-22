// apps/api/src/database/seeding/seeds/seed-date-ranges.ts

import { AppDataSource } from '../../data-source';
import { DateRangeEntity } from '../../entities/date-range.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { generateDateRanges } from '../factories/date-range.factory';

//----------------------------------------------------------------------

export async function seedDateRanges(
  organizations: OrganizationEntity[]
): Promise<DateRangeEntity[]> {
  const dateRangesData = generateDateRanges();
  const allDateRanges: Partial<DateRangeEntity>[] = [];

  for (const org of organizations) {
    const orgDateRanges = dateRangesData.map((dateRange) => ({
      ...dateRange,
      organizationId: org.id,
    }));
    allDateRanges.push(...orgDateRanges);
  }

  const savedDateRanges = await AppDataSource.manager.save(
    DateRangeEntity,
    allDateRanges
  );

  console.log(`✅ Created ${savedDateRanges.length} date ranges`);
  return savedDateRanges;
}
