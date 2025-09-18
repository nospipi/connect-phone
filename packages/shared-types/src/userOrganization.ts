//packages/shared-types/src/userOrganization.ts

import { IUser } from "./user";
import { UserOrganizationRole } from "./userOrganizationRole";
import { IOrganization } from "./organization";

export interface IUserOrganization {
  id: number;
  userId: number;
  organizationId: number;
  role: UserOrganizationRole;
  user: IUser;
  organization: IOrganization;
}
