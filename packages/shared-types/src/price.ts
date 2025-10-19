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

export const CURRENCIES = [
  { code: Currency.USD, name: "US Dollar" },
  { code: Currency.EUR, name: "Euro" },
  { code: Currency.GBP, name: "British Pound" },
  { code: Currency.JPY, name: "Japanese Yen" },
  { code: Currency.AUD, name: "Australian Dollar" },
  { code: Currency.CAD, name: "Canadian Dollar" },
  { code: Currency.CHF, name: "Swiss Franc" },
  { code: Currency.CNY, name: "Chinese Yuan" },
  { code: Currency.HKD, name: "Hong Kong Dollar" },
  { code: Currency.NZD, name: "New Zealand Dollar" },
] as const;

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
