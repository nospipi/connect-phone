/* eslint-disable prettier/prettier */

import {
  pgTable,
  serial,
  timestamp,
  text,
  integer,
  pgEnum,
  //index,
  varchar,
  uuid,
  smallserial,
} from "drizzle-orm/pg-core";
import { relations, SQL, sql } from "drizzle-orm";

//---------------------------------------------------------------------------------------------

//ORGANIZATIONS
export const organizations = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 285500 }),
  uuid: uuid().defaultRandom().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  name: text().notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  logoUrl: text(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(usersInOrganizations),
  loggedInUsers: many(users, { relationName: "loggedToOrganization" }),
}));

//---------------------------------------------------------------------------------------------

//USERS
export const roleEnum = pgEnum("role_type", [
  "SYS_ADMIN",
  "ORG_ADMIN",
  "ORG_MODERATOR",
  "ORG_VIEWER",
  "ORG_CLIENT",
]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 675500 }),
  uuid: uuid().defaultRandom().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  firstName: varchar({ length: 255 }).notNull().unique(),
  lastName: varchar({ length: 255 }).notNull().unique(),
  fullName: text()
    .generatedAlwaysAs(
      (): SQL => sql`${users.firstName} || ' ' || ${users.lastName}`
    )
    .notNull(),
  loggedToOrganizationId: integer().references(() => organizations.id, {
    onDelete: "set null",
  }),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  organizations: many(usersInOrganizations),
  loggedToOrganization: one(organizations, {
    fields: [users.loggedToOrganizationId],
    references: [organizations.id],
  }),
}));

export const usersInOrganizations = pgTable("usersInOrganizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 100000 }),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: integer()
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  role: roleEnum().notNull(),
});

export const usersInOrganizationsRelations = relations(
  usersInOrganizations,
  ({ one }) => ({
    user: one(users, {
      fields: [usersInOrganizations.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [usersInOrganizations.organizationId],
      references: [organizations.id],
    }),
  })
);

//---------------------------------------------------------------------------------------------

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
