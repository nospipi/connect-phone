// packages/shared-types/src/offerExclusion.ts

import { IOrganization } from "./organization";

//----------------------------------------------------------------------

export interface IOfferExclusion {
  id: number;
  body: string;
  organizationId: number;
  organization: IOrganization;
  createdAt: string;
  updatedAt: string;
}
