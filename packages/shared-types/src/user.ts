import { Organization } from "./organization";

export interface User {
  id: number;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  loggedOrganization: Organization | null | undefined;
  organizations: Organization[];
}
