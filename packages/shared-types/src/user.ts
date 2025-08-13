import { Organization } from "./organization";

export interface User {
  id: number;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  loggedOrganizationId: number | null | undefined;
  organizations: Organization[];
}
