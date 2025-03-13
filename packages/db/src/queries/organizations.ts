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

export const getOrganizationById = async (
  organizationId: number
): Promise<Organization | null> => {
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, organizationId),
  });

  return organization ?? null;
};

export const addLogoUrlToOrganization = async (
  createOrganizationDto: Organization,
  organizationId: number
): Promise<Organization | null> => {
  console.log(
    "Adding logo URL to organization in db package",
    createOrganizationDto
  );
  const organization = await db
    .update(organizations)
    .set({
      logoUrl: createOrganizationDto.logoUrl,
    })
    .where(eq(organizations.id, organizationId))
    .returning()
    .then((res) => res[0] ?? null);

  return organization;
};
