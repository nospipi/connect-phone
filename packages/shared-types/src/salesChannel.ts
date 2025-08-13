import { Organization } from "./organization";

export interface SalesChannel {
  id?: number;
  name: string;
  logoUrl?: string | null | undefined;
  description?: string | null | undefined;
  organizationId: number;
}
