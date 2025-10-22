// packages/shared-types/src/offerInclusion.ts

import { IOrganization } from "./organization";

//----------------------------------------------------------------------

export interface IOfferInclusion {
  id: number;
  body: string;
  organizationId: number;
  organization: IOrganization;
  createdAt: string;
  updatedAt: string;
}
