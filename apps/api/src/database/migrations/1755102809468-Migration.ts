import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755102809468 implements MigrationInterface {
    name = 'Migration1755102809468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales_channels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying(500), "logoUrl" character varying(500), "organizationId" integer, CONSTRAINT "UQ_4aa8d9a1c00ca11dd9faa850c31" UNIQUE ("name", "organizationId"), CONSTRAINT "PK_2cc4a647500deae01e9f9ef0e47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "loggedOrganizationId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "logoUrl" character varying(500), CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_60324d0441bf2221bc861321835" FOREIGN KEY ("loggedOrganizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_60324d0441bf2221bc861321835"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "sales_channels"`);
    }

}
