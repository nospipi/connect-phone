import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754925866967 implements MigrationInterface {
    name = 'Migration1754925866967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "logoUrl"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "logoUrl" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "logoUrl"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "logoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
