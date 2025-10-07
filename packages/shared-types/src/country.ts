// packages/shared-types/src/country.ts

import { IOrganization } from "./organization";

export enum CountryRegion {
  EUROPE = "europe",
  AMERICA = "america",
  ASIA = "asia",
  AFRICA = "africa",
  OCEANIA = "oceania",
}

export interface ICountry {
  id: number;
  name: string;
  code: string;
  flagAvatarUrl: string | null;
  flagProductImageUrl: string | null;
  region: CountryRegion;
  organizationId: number;
  organization: IOrganization;
  createdAt: string;
  updatedAt: string;
}
