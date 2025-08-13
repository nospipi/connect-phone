export interface User {
  id: number;
  uuid: string;
  createdAt: string; // ISO timestamp
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  loggedToOrganizationId: number | null;
}
