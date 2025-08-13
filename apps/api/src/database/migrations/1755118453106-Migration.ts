import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755118453106 implements MigrationInterface {
    name = 'Migration1755118453106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_organizations_organizations" ("usersId" integer NOT NULL, "organizationsId" integer NOT NULL, CONSTRAINT "PK_9e23c8351fab70ec6b54cff0a06" PRIMARY KEY ("usersId", "organizationsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6331f0090f532633a6efe2f328" ON "users_organizations_organizations" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_75ea99feb7503be1965ed5c7c2" ON "users_organizations_organizations" ("organizationsId") `);
        await queryRunner.query(`ALTER TABLE "users_organizations_organizations" ADD CONSTRAINT "FK_6331f0090f532633a6efe2f3283" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_organizations_organizations" ADD CONSTRAINT "FK_75ea99feb7503be1965ed5c7c25" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_organizations_organizations" DROP CONSTRAINT "FK_75ea99feb7503be1965ed5c7c25"`);
        await queryRunner.query(`ALTER TABLE "users_organizations_organizations" DROP CONSTRAINT "FK_6331f0090f532633a6efe2f3283"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75ea99feb7503be1965ed5c7c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6331f0090f532633a6efe2f328"`);
        await queryRunner.query(`DROP TABLE "users_organizations_organizations"`);
    }

}
