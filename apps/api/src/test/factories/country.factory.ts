// apps/api/src/test/factories/country.factory.ts

import { ICountry, CountryRegion } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockCountry(overrides?: Partial<ICountry>): ICountry {
  return {
    id: 1,
    name: 'Greece',
    code: 'gr',
    flagAvatarUrl: 'https://flagcdn.com/56x42/gr.webp',
    flagProductImageUrl: 'https://flagcdn.com/192x144/gr.webp',
    region: CountryRegion.EUROPE,
    organizationId: 1,
    organization: createMockOrganization(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as ICountry;
}
