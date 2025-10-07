// apps/api/src/test/factories/user-invitation.factory.ts

import {
  IUserInvitation,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';
import { createMockUser } from './user.factory';

export function createMockUserInvitation(
  overrides?: Partial<IUserInvitation>
): IUserInvitation {
  return {
    id: 1,
    email: 'invite@example.com',
    role: UserOrganizationRole.OPERATOR,
    createdAt: '2024-01-01T00:00:00Z',
    organizationId: 1,
    organization: createMockOrganization(),
    invitedById: 1,
    invitedBy: createMockUser(),
    ...overrides,
  } as IUserInvitation;
}
