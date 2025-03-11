import { desc, eq, sql, and } from "drizzle-orm";
import {
  users,
  usersInOrganizations,
  User,
  Organization,
  organizations,
} from "../schema";
import { db } from "../index";

export const createOrganization = async (
  createOrganizationDto: Organization
): Promise<Organization | null> => {
  const organization = await db
    .insert(organizations)
    .values(createOrganizationDto)
    .returning()
    .then((res) => res[0] ?? null);

  return organization;
};
