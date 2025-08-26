import { IUser, UserOrganizationRole } from "./user";
import { IOrganization } from "./organization";

export interface IUserOrganization {
  id: number;
  userId: number;
  organizationId: number;
  role: UserOrganizationRole;
  user: IUser;
  organization: IOrganization;
}
