import { IUser } from "./user";
import { IOrganization } from "./organization";

export interface IAuditLog {
  id: number;
  table_name: string;
  row_id: string;
  operation: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  user: IUser | null;
  userId: number | null;
  organization: IOrganization | null;
  organizationId: number | null;
  created_at: Date;
}
