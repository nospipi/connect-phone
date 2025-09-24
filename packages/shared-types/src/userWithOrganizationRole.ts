// packages/shared-types/src/user.ts (add this to your shared types)
import { IUser } from "./user";
import { UserOrganizationRole } from "./userOrganizationRole";

export interface IUserWithOrganizationRole extends IUser {
  role: UserOrganizationRole;
}
