// apps/api/src/test/factories/date-range.factory.ts

import { IDateRange } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockDateRange(
  overrides?: Partial<IDateRange>
): IDateRange {
  return {
    id: 1,
    name: 'Q1 2025',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    organizationId: 1,
    organization: createMockOrganization(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as IDateRange;
}
