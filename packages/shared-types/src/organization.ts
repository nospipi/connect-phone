// packages/shared-types/src/organization.ts

import { ISalesChannel } from "./salesChannel";
import { IAuditLog } from "./auditLog";
import { IUserOrganization } from "./userOrganization";
import { ICountry } from "./country";

export interface IOrganization {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  salesChannels: ISalesChannel[];
  userOrganizations: IUserOrganization[];
  auditLogs: IAuditLog[];
  countries: ICountry[];
}
