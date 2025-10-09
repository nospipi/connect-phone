// packages/shared-types/src/organization.ts

import { ISalesChannel } from "./salesChannel";
import { IAuditLog } from "./auditLog";
import { IUserOrganization } from "./userOrganization";
import { ICountry } from "./country";

// Top 10 most traded currencies
export enum Currencies {
  USD = "USD", // US Dollar
  EUR = "EUR", // Euro
  JPY = "JPY", // Japanese Yen
  GBP = "GBP", // British Pound Sterling
  AUD = "AUD", // Australian Dollar
  CAD = "CAD", // Canadian Dollar
  CHF = "CHF", // Swiss Franc
  CNY = "CNY", // Chinese Yuan
  HKD = "HKD", // Hong Kong Dollar
  NZD = "NZD", // New Zealand Dollar
}

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
  mainCurrency: Currencies; // New property using the enum
}
