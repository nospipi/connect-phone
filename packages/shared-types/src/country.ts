//packages/shared-types/src/country.ts

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
  createdAt: string;
  updatedAt: string;
}
