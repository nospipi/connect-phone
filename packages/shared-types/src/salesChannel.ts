// packages/shared-types/src/salesChannel.ts
import { IOrganization } from "./organization";
import { IMedia } from "./media";

//----------------------------------------------------------------------

export interface ISalesChannel {
  id: number;
  name: string;
  description: string | null | undefined;
  logoId: number | null;
  logo: IMedia | null;
  organizationId: number;
  organization: IOrganization;
  isActive: boolean;
}
