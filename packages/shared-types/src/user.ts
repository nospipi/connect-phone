//packages/shared-types/src/user.ts

import { IOrganization } from "./organization";
import { IAuditLog } from "./auditLog";
import { IUserOrganization } from "./userOrganization";

export interface IUser {
  id: number;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  loggedOrganizationId: number | null;
  loggedOrganization: IOrganization | null;
  userOrganizations: IUserOrganization[]; // ← changed from simplified
  auditLogs: IAuditLog[];
}
