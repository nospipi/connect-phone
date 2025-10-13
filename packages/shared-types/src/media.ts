// packages/shared-types/src/media.ts

import { IOrganization } from "./organization";

export interface IMedia {
  id: number;
  url: string;
  description: string | null;
  organizationId: number;
  organization: IOrganization;
  createdAt: string;
  updatedAt: string;
}
