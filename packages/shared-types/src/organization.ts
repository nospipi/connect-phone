import { ISalesChannel } from "./salesChannel";
import { IUser, UserOrganizationRole } from "./user";

export interface IOrganization {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  salesChannels: ISalesChannel[];
  userOrganizations: {
    user: IUser;
    role: UserOrganizationRole;
  }[];
}
