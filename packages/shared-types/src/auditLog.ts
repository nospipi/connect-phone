import { IUser } from "./user";

export interface IAuditLog {
  id: number;
  table_name: string;
  row_id: string;
  operation: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  actor: IUser | null;
  created_at: Date;
}
