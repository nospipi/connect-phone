//packages/shared-types/src/organization.ts

import { ISalesChannel } from "./salesChannel";
import { IUser } from "./user";
import { UserOrganizationRole } from "./userOrganizationRole";

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
