import { ISalesChannel } from "./salesChannel";
import { IUser } from "./user";

export interface IOrganization {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  salesChannels: ISalesChannel[];
  users: IUser[];
}
