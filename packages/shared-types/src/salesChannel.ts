import { Organization } from "./organization";

export interface SalesChannel {
  id?: number;
  organization: Organization;
  name: string;
  logoUrl?: string | null | undefined;
  description?: string | null | undefined;
}
