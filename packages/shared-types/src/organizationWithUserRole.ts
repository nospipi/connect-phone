//packages/shared-types/src/organizationWithUserRole.ts

import { ISalesChannel } from "./salesChannel";
import { IUser } from "./user";
import { UserOrganizationRole } from "./userOrganizationRole";

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
