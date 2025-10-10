// packages/shared-types/src/price.ts

import { IDateRange } from "./dateRange";
import { ISalesChannel } from "./salesChannel";

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
  amount: number;
  currency: Currency;
  isDateBased: boolean;
  dateRanges: IDateRange[];
  salesChannels: ISalesChannel[];
  createdAt: string;
  updatedAt: string;
}
