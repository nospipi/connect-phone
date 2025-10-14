// apps/api/src/test/factories/organization.factory.ts

import { IOrganization } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

export function createMockOrganization(
  overrides?: Partial<IOrganization>
): IOrganization {
  return {
    id: 1,
    name: 'Test Organization',
    slug: 'test-org',
    logoId: null,
    logo: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
    countries: [],
    prices: [],
    dateRanges: [],
    media: [],
    mainCurrency: 'USD' as any,
    ...overrides,
  } as IOrganization;
}
