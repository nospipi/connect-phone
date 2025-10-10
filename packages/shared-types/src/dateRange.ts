// packages/shared-types/src/dateRange.ts

import { IOrganization } from "./organization";

export interface IDateRange {
  id: number;
  startDate: string;
  endDate: string;
  organizationId: number;
  organization: IOrganization;
  createdAt: string;
  updatedAt: string;
}
