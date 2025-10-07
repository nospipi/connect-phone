// apps/api/src/test/factories/audit-log.factory.ts

import { IAuditLog } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockAuditLog(overrides?: Partial<IAuditLog>): IAuditLog {
  return {
    id: 1,
    table_name: 'sales_channels',
    row_id: '1',
    operation: 'INSERT',
    before: null,
    after: { name: 'Test Channel' },
    organizationId: 1,
    organization: createMockOrganization(),
    userId: 1,
    user: null,
    created_at: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  } as IAuditLog;
}
