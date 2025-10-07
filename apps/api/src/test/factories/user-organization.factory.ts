// apps/api/src/test/factories/user-organization.factory.ts
import {
  IUserOrganization,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { createMockUser } from './user.factory';
import { createMockOrganization } from './organization.factory';

export function createMockUserOrganization(
  overrides?: Partial<IUserOrganization>
): IUserOrganization {
  const user =
    overrides?.user !== undefined ? overrides.user : createMockUser();
  const organization =
    overrides?.organization !== undefined
      ? overrides.organization
      : createMockOrganization();

  return {
    id: 1,
    userId: user?.id || 1,
    organizationId: organization?.id || 1,
    role: UserOrganizationRole.OPERATOR,
    user: user as any, // Cast to handle null case
    organization: organization as any, // Cast to handle null case
    ...overrides,
  } as IUserOrganization;
}
