// apps/api/src/test/factories/esim-offer.factory.ts
import { IEsimOffer } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

//----------------------------------------------------------------------

export function createMockEsimOffer(
  overrides?: Partial<IEsimOffer>
): IEsimOffer {
  return {
    id: 1,
    title: 'Greece 5GB 30 Days',
    descriptionHtml: '<p>Perfect for your Greek vacation</p>',
    descriptionText: 'Perfect for your Greek vacation',
    durationInDays: 30,
    dataInGb: 5,
    organizationId: 1,
    organization: createMockOrganization(),
    inclusions: [],
    exclusions: [],
    mainImageId: null,
    mainImage: null,
    images: [],
    countries: [],
    salesChannels: [],
    prices: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as IEsimOffer;
}
