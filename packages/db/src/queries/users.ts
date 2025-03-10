import { desc, eq, sql, and } from "drizzle-orm";
import { users, usersInOrganizations, User, Organization } from "../schema";
import { db } from "../index";

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  return await db.query.users.findMany();
};

/**
 * Get a user by email
 */
export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

/**
 * Check if a user belongs to an organization
 */
export const isUserInOrganization = async (
  userId: number,
  organizationId: number
): Promise<boolean> => {
  const membership = await db.query.usersInOrganizations.findFirst({
    where: and(
      eq(usersInOrganizations.userId, userId),
      eq(usersInOrganizations.organizationId, organizationId)
    ),
  });

  return membership !== undefined;
};

/**
 * Check if a user with a specific email belongs to an organization
 */
export const isUserWithEmailInOrganization = async (
  email: string,
  organizationId: number
): Promise<boolean> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      organizations: {
        where: eq(usersInOrganizations.organizationId, organizationId),
      },
    },
  });

  return user !== undefined && user.organizations.length > 0;
};

/**
 * Check if a user is an admin in an organization
 */
export const isUserAdminInOrganization = async (
  userId: number,
  organizationId: number
): Promise<boolean> => {
  const membership = await db.query.usersInOrganizations.findFirst({
    where: and(
      eq(usersInOrganizations.userId, userId),
      eq(usersInOrganizations.organizationId, organizationId),
      eq(usersInOrganizations.role, "ORG_ADMIN")
    ),
  });

  return membership !== undefined;
};

/**
 * Check if a user with a specific email is an admin in an organization
 */
export const isUserWithEmailAdminInOrganization = async (
  email: string,
  organizationId: number
): Promise<boolean> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      organizations: {
        where: and(
          eq(usersInOrganizations.organizationId, organizationId),
          eq(usersInOrganizations.role, "ORG_ADMIN")
        ),
      },
    },
  });

  return user !== undefined && user.organizations.length > 0;
};

/**
 * Get all organizations a user belongs to with their roles
 */
export const getUserOrganizations = async (userId: number) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      organizations: {
        with: {
          organization: true,
        },
      },
    },
  });

  return user?.organizations || [];
};
