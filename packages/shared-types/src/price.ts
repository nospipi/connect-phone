// packages/shared-types/src/price.ts

import { IDateRange } from "./dateRange";
import { ISalesChannel } from "./salesChannel";
import { IOrganization } from "./organization";

//----------------------------------------------------------------------

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  AUD = "AUD",
  CAD = "CAD",
  CHF = "CHF",
  CNY = "CNY",
  HKD = "HKD",
  NZD = "NZD",
}

export interface IPrice {
  id: number;
  name: string;
  amount: number;
  currency: Currency;
  isDateBased: boolean;
  organizationId: number;
  organization: IOrganization;
  dateRanges: IDateRange[];
  salesChannels: ISalesChannel[];
  createdAt: string;
  updatedAt: string;
}
