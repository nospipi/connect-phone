import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754925898314 implements MigrationInterface {
    name = 'Migration1754925898314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
