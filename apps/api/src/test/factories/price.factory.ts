// apps/api/src/test/factories/price.factory.ts

import { IPrice, Currency } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

//----------------------------------------------------------------------

export function createMockPrice(overrides?: Partial<IPrice>): IPrice {
  return {
    id: 1,
    name: 'Test Price',
    amount: 10.0,
    currency: Currency.USD,
    isDateBased: false,
    organizationId: 1,
    organization: createMockOrganization(),
    dateRanges: [],
    salesChannels: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as IPrice;
}
