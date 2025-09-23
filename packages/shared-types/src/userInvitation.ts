// packages/shared-types/src/userInvitation.ts

import { IOrganization } from "./organization";
import { UserOrganizationRole } from "./userOrganizationRole";
import { IUser } from "./user";

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

//----------------------------------------------------------------------------

export interface IUserInvitation {
  id: number;
  email: string;
  role: UserOrganizationRole;
  status: InvitationStatus;
  createdAt: string;
  organizationId: number;
  organization: IOrganization;
  invitedById: number;
  invitedBy: IUser;
}
