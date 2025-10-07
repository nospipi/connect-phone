// apps/api/src/test/factories/user.factory.ts

import { IUser } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockUser(overrides?: Partial<IUser>): IUser {
  return {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: createMockOrganization(),
    userOrganizations: [],
    auditLogs: [],
    ...overrides,
  } as IUser;
}
