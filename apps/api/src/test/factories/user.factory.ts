// apps/api/src/test/factories/user.factory.ts
import { IUser, UserOrganizationRole } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockUser(overrides?: Partial<IUser>): IUser {
  return {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: null,
    loggedOrganization: null,
    userOrganizations: [],
    auditLogs: [],
    ...overrides,
  } as IUser;
}

// Helper for when need a fully connected user
export function createMockUserWithOrganization(
  userOverrides?: Partial<IUser>,
  role: UserOrganizationRole = UserOrganizationRole.OPERATOR
): IUser {
  const organization = createMockOrganization();
  const user = createMockUser({
    loggedOrganizationId: organization.id,
    loggedOrganization: organization,
    ...userOverrides,
  });

  // Create userOrganization after to avoid circular ref
  user.userOrganizations = [
    {
      id: 1,
      userId: user.id,
      organizationId: organization.id,
      role,
      user: user as any,
      organization,
    } as any,
  ];

  return user;
}
