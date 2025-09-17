import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1758015144676 implements MigrationInterface {
  name = 'Migration1758015144676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sales_channels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying(500), "logoUrl" character varying(500), "organizationId" integer NOT NULL, CONSTRAINT "UQ_4aa8d9a1c00ca11dd9faa850c31" UNIQUE ("name", "organizationId"), CONSTRAINT "PK_2cc4a647500deae01e9f9ef0e47" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "table_name" character varying NOT NULL, "row_id" character varying NOT NULL, "operation" character varying NOT NULL, "before" jsonb, "after" jsonb, "organizationId" integer, "userId" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "loggedOrganizationId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_organizations" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "organizationId" integer NOT NULL, "role" "public"."user_organizations_role_enum" NOT NULL DEFAULT 'OPERATOR', CONSTRAINT "UQ_481a3d21c68396d6b180ab9795d" UNIQUE ("userId", "organizationId"), CONSTRAINT "PK_51ed3f60fdf013ee5041d2d4d3d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "logoUrl" character varying(500), CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_invitations" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "status" "public"."user_invitations_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" integer NOT NULL, "invitedById" integer NOT NULL, CONSTRAINT "UQ_0c2e7a9847d2f339d7f6c917796" UNIQUE ("email", "organizationId"), CONSTRAINT "PK_c8005acb91c3ce9a7ae581eca8f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "sales_channels" ADD CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_2d031e6155834882f54dcd6b4f5" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_60324d0441bf2221bc861321835" FOREIGN KEY ("loggedOrganizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_11d4cd5202bd8914464f4bec379" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_71997faba4726730e91d514138e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_6c4273e18d6b7e7b02aa64b4b2d" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_f679e6eb5e1629f143a0d1cd3f9" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_f679e6eb5e1629f143a0d1cd3f9"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_6c4273e18d6b7e7b02aa64b4b2d"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_71997faba4726730e91d514138e"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_11d4cd5202bd8914464f4bec379"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_60324d0441bf2221bc861321835"`
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab"`
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_2d031e6155834882f54dcd6b4f5"`
    );
    await queryRunner.query(
      `ALTER TABLE "sales_channels" DROP CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0"`
    );
    await queryRunner.query(`DROP TABLE "user_invitations"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "user_organizations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "sales_channels"`);
  }
}
