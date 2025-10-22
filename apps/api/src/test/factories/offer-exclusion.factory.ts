// apps/api/src/test/factories/offer-exclusion.factory.ts
import { IOfferExclusion } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

//----------------------------------------------------------------------

export function createMockOfferExclusion(
  overrides?: Partial<IOfferExclusion>
): IOfferExclusion {
  return {
    id: 1,
    body: 'Excludes previous orders and gift cards',
    organizationId: 1,
    organization: createMockOrganization(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as IOfferExclusion;
}
