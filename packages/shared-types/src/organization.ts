// packages/shared-types/src/organization.ts

import { ISalesChannel } from "./salesChannel";
import { IAuditLog } from "./auditLog";
import { IUserOrganization } from "./userOrganization";
import { ICountry } from "./country";
import { IPrice } from "./price";
import { IDateRange } from "./dateRange";
import { IMedia } from "./media";
import { Currency } from "./price";

//----------------------------------------------------------------------

export interface IOrganization {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoId: number | null;
  logo: IMedia | null;
  salesChannels: ISalesChannel[];
  userOrganizations: IUserOrganization[];
  auditLogs: IAuditLog[];
  countries: ICountry[];
  prices: IPrice[];
  dateRanges: IDateRange[];
  media: IMedia[];
  mainCurrency: Currency;
}
