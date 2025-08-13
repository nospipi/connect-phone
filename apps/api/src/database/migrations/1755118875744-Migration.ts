import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755118875744 implements MigrationInterface {
    name = 'Migration1755118875744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0"`);
    }

}
