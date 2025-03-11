import { desc, eq, sql, and } from "drizzle-orm";
import { users, usersInOrganizations, User, Organization } from "../schema";
import { db } from "../index";

//----------------------------------------------------------------------

export const createUser = async (userDto: User): Promise<User | null> => {
  const user = await db
    .insert(users)
    .values(userDto)
    .returning()
    .then((res) => res[0] ?? null);

  return user;
};

export const createBlankUser = async (
  blankUserDto: User
): Promise<User | null> => {
  const user = await db
    .insert(users)
    .values(blankUserDto)
    .returning()
    .then((res) => res[0] ?? null);

  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  return await db.query.users.findMany();
};

export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

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
