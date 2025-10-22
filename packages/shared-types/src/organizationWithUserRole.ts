// packages/shared-types/src/organizationWithUserRole.ts

import { ISalesChannel } from "./salesChannel";
import { UserOrganizationRole } from "./userOrganizationRole";
import { IMedia } from "./media";
import { Currency } from "./price";
import { IUserOrganization } from "./userOrganization";
import { IAuditLog } from "./auditLog";
import { ICountry } from "./country";
import { IPrice } from "./price";
import { IDateRange } from "./dateRange";
import { IOfferInclusion } from "./offerInclusion";
import { IOfferExclusion } from "./offerExclusion";
import { IOffer } from "./offer";

//----------------------------------------------------------------------

export interface IOrganizationWithUserRole {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoId: number | null;
  logo: IMedia | null;
  role: UserOrganizationRole;
  mainCurrency: Currency;
  salesChannels: ISalesChannel[];
  userOrganizations: IUserOrganization[];
  auditLogs: IAuditLog[];
  countries: ICountry[];
  prices: IPrice[];
  dateRanges: IDateRange[];
  media: IMedia[];
  offerInclusions: IOfferInclusion[];
  offerExclusions: IOfferExclusion[];
  offers: IOffer[];
}
