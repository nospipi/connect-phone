import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754918434555 implements MigrationInterface {
    name = 'Migration1754918434555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP COLUMN "createdAt"`);
    }

}
