import { ISalesChannel } from "./salesChannel";
import { IUser, UserOrganizationRole } from "./user";

export interface IOrganizationWithUserRole {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: UserOrganizationRole;
  salesChannels: ISalesChannel[];
  userOrganizations: {
    user: IUser;
    role: UserOrganizationRole;
  }[];
}
