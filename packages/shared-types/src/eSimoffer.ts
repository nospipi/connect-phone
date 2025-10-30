// packages/shared-types/src/eSimoffer.ts

import { IOrganization } from "./organization";
import { IOfferInclusion } from "./offerInclusion";
import { IOfferExclusion } from "./offerExclusion";
import { IMedia } from "./media";
import { ICountry } from "./country";
import { ISalesChannel } from "./salesChannel";
import { IPrice } from "./price";

//----------------------------------------------------------------------

export interface IEsimOffer {
  id: number;
  title: string;
  descriptionHtml: string;
  descriptionText: string;
  durationInDays: number;
  dataInGb: number | null;
  isUnlimitedData: boolean;
  isActive: boolean;
  organizationId: number;
  organization: IOrganization;
  inclusions: IOfferInclusion[];
  exclusions: IOfferExclusion[];
  mainImageId: number | null;
  mainImage: IMedia | null;
  images: IMedia[];
  countries: ICountry[];
  salesChannels: ISalesChannel[];
  prices: IPrice[];
  createdAt: string;
  updatedAt: string;
}
