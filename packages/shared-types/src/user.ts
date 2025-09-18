//packages/shared-types/src/user.ts

import { IOrganization } from "./organization";
import { IAuditLog } from "./auditLog";
import { UserOrganizationRole } from "./userOrganizationRole";

export interface IUser {
  id: number;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  loggedOrganizationId: number | null;
  userOrganizations: {
    organization: IOrganization;
    role: UserOrganizationRole;
  }[];
  auditLogs?: IAuditLog[];
}
