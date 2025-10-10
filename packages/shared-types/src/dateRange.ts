// packages/shared-types/src/dateRange.ts

import { IOrganization } from "./organization";

export interface IDateRange {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  organizationId: number;
  organization: IOrganization;
  createdAt: string;
  updatedAt: string;
}
