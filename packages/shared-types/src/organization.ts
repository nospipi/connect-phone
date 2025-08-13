import { SalesChannel } from "./salesChannel";
import { User } from "./user";

export interface Organization {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  salesChannels: SalesChannel[];
  users: User[];
}
