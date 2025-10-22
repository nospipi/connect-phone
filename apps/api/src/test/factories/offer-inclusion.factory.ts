// apps/api/src/test/factories/offer-inclusion.factory.ts
import { IOfferInclusion } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

//----------------------------------------------------------------------

export function createMockOfferInclusion(
  overrides?: Partial<IOfferInclusion>
): IOfferInclusion {
  return {
    id: 1,
    body: 'Free shipping on orders over $50',
    organizationId: 1,
    organization: createMockOrganization(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as IOfferInclusion;
}
