export interface SalesChannel {
  id: number;
  uuid: string;
  name: string;
  organizationId:
   number;
  logoUrl?: string | null;
  description: string | null;
}
