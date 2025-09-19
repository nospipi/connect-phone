//packages/shared-types/src/salesChannel.ts
import { IOrganization } from "./organization";

export interface ISalesChannel {
  id: number;
  name: string;
  logoUrl: string | null | undefined;
  description: string | null | undefined;
  organizationId: number;
  organization: IOrganization;
}
