// import { desc, eq, sql, and } from "drizzle-orm";
// import { users, usersInOrganizations, User, Organization } from "../../schema";
// import { db } from "../../index";

// export const getAllUsers = async (): Promise<User[]> => {
//   const result = db.select().from(users);
//   return result;
// };

// export const getUserByEmail = async (email: string): Promise<User | null> => {
//   console.log("getUserByEmail", email);
//   const result = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   return result.length > 0 ? result[0] : null;
// };

// /**
//  * Check if a user belongs to a specific organization
//  * @param userId The ID of the user
//  * @param organizationId The ID of the organization
//  * @returns Boolean indicating if the user belongs to the organization
//  */
// export const isUserInOrganization = async (
//   userId: number,
//   organizationId: number
// ): Promise<boolean> => {
//   console.log("isUserInOrganization", userId, organizationId);
//   const result = await db
//     .select({ count: sql`count(*)` })
//     .from(usersInOrganizations)
//     .where(
//       and(
//         eq(usersInOrganizations.userId, userId),
//         eq(usersInOrganizations.organizationId, organizationId)
//       )
//     );

//   // Convert the count from string to number and check if greater than 0
//   return Number(result[0].count) > 0;
// };

// /**
//  * Check if a user with a given email belongs to a specific organization
//  * @param email The email of the user
//  * @param organizationId The ID of the organization
//  * @returns Boolean indicating if the user belongs to the organization
//  */
// // export const isUserWithEmailInOrganization = async (
// //   email: string,
// //   organizationId: number
// // ): Promise<boolean> => {
// //   console.log("isUserWithEmailInOrganization", email, organizationId);
// //   const user = await db
// //     .select()
// //     .from(users)
// //     .where(eq(users.email, email))
// //     .limit(1);

// //   if (user.length === 0) {
// //     return false; // User not found
// //   }

// //   // Then check if the user is in the organization
// //   return isUserInOrganization(user[0].id, organizationId);
// // };

// export const isUserWithEmailInOrganization = async (
//   email: string,
//   organizationId: number
// ): Promise<boolean> => {
//   const user = await db.query.users.findFirst({
//     where: eq(users.email, email),
//     with: {
//       organizations: {
//         where: eq(usersInOrganizations.organizationId, organizationId),
//       },
//     },
//   });

//   return user !== undefined && user.organizations.length > 0;
// };

// /**
//  * Checks if a user is an admin in a specific organization
//  * @param userId The ID of the user
//  * @param organizationId The ID of the organization
//  * @returns Boolean indicating if the user is an admin in the organization
//  */
// export const isUserAdminInOrganization = async (
//   userId: number,
//   organizationId: number
// ): Promise<boolean> => {
//   console.log("isUserAdminInOrganization", userId, organizationId);
//   const result = await db
//     .select({ count: sql`count(*)` })
//     .from(usersInOrganizations)
//     .where(
//       and(
//         eq(usersInOrganizations.userId, userId),
//         eq(usersInOrganizations.organizationId, organizationId),
//         eq(usersInOrganizations.role, "ADMIN")
//       )
//     );

//   return Number(result[0].count) > 0;
// };

// repositories/users.ts
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
      eq(usersInOrganizations.role, "ADMIN")
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
          eq(usersInOrganizations.role, "ADMIN")
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
