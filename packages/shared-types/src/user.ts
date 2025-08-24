import { IOrganization } from "./organization";

export enum UserOrganizationRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
}

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
}
