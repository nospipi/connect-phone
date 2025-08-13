import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755105444213 implements MigrationInterface {
    name = 'Migration1755105444213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_60324d0441bf2221bc861321835"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "loggedOrganizationId" TO "loggedOrganizationIdId"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "description" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4c3a9a1fb3dc1f9fe81c2528c20" FOREIGN KEY ("loggedOrganizationIdId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4c3a9a1fb3dc1f9fe81c2528c20"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "loggedOrganizationIdId" TO "loggedOrganizationId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_60324d0441bf2221bc861321835" FOREIGN KEY ("loggedOrganizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
