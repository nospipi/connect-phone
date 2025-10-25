import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753805291028 implements MigrationInterface {
    name = 'InitialMigration1753805291028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales_channels" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "organizationId" integer NOT NULL, CONSTRAINT "UQ_91a38cd241812aa7102f031936d" UNIQUE ("uuid"), CONSTRAINT "PK_2cc4a647500deae01e9f9ef0e47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "uuid" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "logoUrl" character varying(500), CONSTRAINT "UQ_94726c8fd554481cd1db1be83e8" UNIQUE ("uuid"), CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sales_channels" ADD CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channels" DROP CONSTRAINT "FK_aa2ac93b34a8f35fcfa26cc10a0"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "sales_channels"`);
    }

}
