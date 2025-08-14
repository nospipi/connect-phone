import { IOrganization } from "./organization";

export interface IUser {
  id: number;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  loggedOrganizationId: number | null | undefined;
  organizations: IOrganization[];
}
