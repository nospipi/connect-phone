CREATE TYPE "public"."role_type" AS ENUM('SYS_ADMIN', 'ORG_ADMIN', 'ORG_MODERATOR', 'ORG_VIEWER', 'ORG_CLIENT');--> statement-breakpoint
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
ALTER TABLE "users" ADD CONSTRAINT "users_loggedToOrganizationId_organizations_id_fk" FOREIGN KEY ("loggedToOrganizationId") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersInOrganizations" ADD CONSTRAINT "usersInOrganizations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersInOrganizations" ADD CONSTRAINT "usersInOrganizations_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;