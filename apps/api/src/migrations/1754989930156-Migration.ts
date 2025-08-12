import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754989930156 implements MigrationInterface {
    name = 'Migration1754989930156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP CONSTRAINT "UQ_91a38cd241812aa7102f031936d"`);
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_94726c8fd554481cd1db1be83e8"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "uuid"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "uuid" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_94726c8fd554481cd1db1be83e8" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "uuid" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD CONSTRAINT "UQ_91a38cd241812aa7102f031936d" UNIQUE ("uuid")`);
    }

}
