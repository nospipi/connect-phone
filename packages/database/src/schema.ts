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
  real,
  date,
  jsonb,
  check,
  decimal,
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
  salesChannels: many(salesChannels),
  offers: many(offers),
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
  authoredOffers: many(offers),
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

//SALES CHANNELS
export const salesChannels = pgTable("salesChannels", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom().notNull().unique(),
  organizationId: integer()
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text().notNull(),
  description: text(),
  imageUrl: text(),
});

export const salesChannelsRelations = relations(
  salesChannels,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [salesChannels.organizationId],
      references: [organizations.id],
    }),
    offerPrices: many(offerPrices),
    images: many(salesChannelImages),
  })
);

//---------------------------------------------------------------------------------------------

//SALES CHANNEL IMAGES
export const salesChannelImages = pgTable("salesChannelImages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  salesChannelId: integer()
    .notNull()
    .references(() => salesChannels.id, { onDelete: "cascade" }),
  url: text().notNull(),
  description: text(),
});

export const salesChannelImagesRelations = relations(
  salesChannelImages,
  ({ one }) => ({
    salesChannel: one(salesChannels, {
      fields: [salesChannelImages.salesChannelId],
      references: [salesChannels.id],
    }),
  })
);

//---------------------------------------------------------------------------------------------

//OFFERS
export const offers = pgTable(
  "offers",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull().unique(),
    title: text().notNull(),
    organizationId: integer()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    authorId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    dataAmountInGb: real().notNull(),
    talkTimeInMinutes: integer(),
    validationDate: date().notNull(),
    expirationDate: date().notNull(),
  },
  (table) => [
    check("dataAmountInGb_non_negative", sql`${table.dataAmountInGb} >= 0`),
    check(
      "talkTimeInMinutes_non_negative",
      sql`${table.talkTimeInMinutes} >= 0`
    ),
  ]
);

export const offersRelations = relations(offers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [offers.organizationId],
    references: [organizations.id],
  }),
  author: one(users, {
    fields: [offers.authorId],
    references: [users.id],
  }),
  images: many(offerImages),
  prices: many(offerPrices),
}));

//---------------------------------------------------------------------------------------------

//OFFER IMAGES
export const offerImages = pgTable("offerImages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  offerId: integer()
    .notNull()
    .references(() => offers.id, { onDelete: "cascade" }),
  url: text().notNull(),
  description: text(),
});

export const offerImagesRelations = relations(offerImages, ({ one }) => ({
  offer: one(offers, {
    fields: [offerImages.offerId],
    references: [offers.id],
  }),
}));

//---------------------------------------------------------------------------------------------

//OFFER PRICES
export const offerPrices = pgTable("offerPrices", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  offerId: integer()
    .notNull()
    .references(() => offers.id, { onDelete: "cascade" }),
  salesChannelId: integer()
    .notNull()
    .references(() => salesChannels.id, { onDelete: "cascade" }),
  currency: text().notNull(), // 'USD', 'EUR', 'GBP'
  price: decimal().notNull(), // use decimal for money
});

export const offerPricesRelations = relations(offerPrices, ({ one }) => ({
  offer: one(offers, {
    fields: [offerPrices.offerId],
    references: [offers.id],
  }),
  salesChannel: one(salesChannels, {
    fields: [offerPrices.salesChannelId],
    references: [salesChannels.id],
  }),
}));

//---------------------------------------------------------------------------------------------

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type SalesChannel = typeof salesChannels.$inferSelect;
export type SalesChannelImage = typeof salesChannelImages.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type OfferImage = typeof offerImages.$inferSelect;
export type OfferPrice = typeof offerPrices.$inferSelect;
