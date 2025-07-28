CREATE TYPE "public"."role_type" AS ENUM('SYS_ADMIN', 'ORG_ADMIN', 'ORG_MODERATOR', 'ORG_VIEWER', 'ORG_CLIENT');--> statement-breakpoint
CREATE TABLE "offerImages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "offerImages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"offerId" integer NOT NULL,
	"url" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "offerPrices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "offerPrices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"offerId" integer NOT NULL,
	"salesChannelId" integer NOT NULL,
	"currency" text NOT NULL,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "offers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"organizationId" integer NOT NULL,
	"authorId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"dataAmountInGb" real NOT NULL,
	"talkTimeInMinutes" integer,
	"validationDate" date NOT NULL,
	"expirationDate" date NOT NULL,
	CONSTRAINT "offers_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "dataAmountInGb_non_negative" CHECK ("offers"."dataAmountInGb" >= 0),
	CONSTRAINT "talkTimeInMinutes_non_negative" CHECK ("offers"."talkTimeInMinutes" >= 0)
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 285500 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"logoUrl" text,
	CONSTRAINT "organizations_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "salesChannelImages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "salesChannelImages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"salesChannelId" integer NOT NULL,
	"url" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "salesChannels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "salesChannels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"imageUrl" text,
	CONSTRAINT "salesChannels_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 675500 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"fullName" text GENERATED ALWAYS AS ("users"."firstName" || ' ' || "users"."lastName") STORED NOT NULL,
	"loggedToOrganizationId" integer,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_firstName_unique" UNIQUE("firstName"),
	CONSTRAINT "users_lastName_unique" UNIQUE("lastName")
);
--> statement-breakpoint
CREATE TABLE "usersInOrganizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "usersInOrganizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 100000 CACHE 1),
	"userId" integer NOT NULL,
	"organizationId" integer NOT NULL,
	"role" "role_type" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offerImages" ADD CONSTRAINT "offerImages_offerId_offers_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offerPrices" ADD CONSTRAINT "offerPrices_offerId_offers_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offerPrices" ADD CONSTRAINT "offerPrices_salesChannelId_salesChannels_id_fk" FOREIGN KEY ("salesChannelId") REFERENCES "public"."salesChannels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesChannelImages" ADD CONSTRAINT "salesChannelImages_salesChannelId_salesChannels_id_fk" FOREIGN KEY ("salesChannelId") REFERENCES "public"."salesChannels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesChannels" ADD CONSTRAINT "salesChannels_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_loggedToOrganizationId_organizations_id_fk" FOREIGN KEY ("loggedToOrganizationId") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersInOrganizations" ADD CONSTRAINT "usersInOrganizations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersInOrganizations" ADD CONSTRAINT "usersInOrganizations_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;