// apps/api/src/test/factories/sales-channel.factory.ts

import { ISalesChannel } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockSalesChannel(
  overrides?: Partial<ISalesChannel>
): ISalesChannel {
  return {
    id: 1,
    name: 'Test Sales Channel',
    description: 'Test Description',
    logoUrl: null,
    organizationId: 1,
    organization: createMockOrganization(),
    isActive: true,
    ...overrides,
  } as ISalesChannel;
}
