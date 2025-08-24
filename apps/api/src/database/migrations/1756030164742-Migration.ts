import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756030164742 implements MigrationInterface {
    name = 'Migration1756030164742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_71997faba4726730e91d514138e"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_11d4cd5202bd8914464f4bec379"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11d4cd5202bd8914464f4bec37"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71997faba4726730e91d514138"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "PK_481a3d21c68396d6b180ab9795d"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "PK_4cb029a69ba48797114d73e82f4" PRIMARY KEY ("userId", "organizationId", "id")`);
        await queryRunner.query(`CREATE TYPE "public"."user_organizations_role_enum" AS ENUM('ADMIN', 'OPERATOR')`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD "role" "public"."user_organizations_role_enum" NOT NULL DEFAULT 'OPERATOR'`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "PK_4cb029a69ba48797114d73e82f4"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "PK_8cf6fce52bbdc5ab0fa4b4465a7" PRIMARY KEY ("organizationId", "id")`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "PK_8cf6fce52bbdc5ab0fa4b4465a7"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "PK_51ed3f60fdf013ee5041d2d4d3d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "UQ_481a3d21c68396d6b180ab9795d" UNIQUE ("userId", "organizationId")`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_11d4cd5202bd8914464f4bec379" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_71997faba4726730e91d514138e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_71997faba4726730e91d514138e"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_11d4cd5202bd8914464f4bec379"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "UQ_481a3d21c68396d6b180ab9795d"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "PK_51ed3f60fdf013ee5041d2d4d3d"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "PK_8cf6fce52bbdc5ab0fa4b4465a7" PRIMARY KEY ("organizationId", "id")`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "PK_8cf6fce52bbdc5ab0fa4b4465a7"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "PK_4cb029a69ba48797114d73e82f4" PRIMARY KEY ("userId", "organizationId", "id")`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_organizations_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP CONSTRAINT "PK_4cb029a69ba48797114d73e82f4"`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "PK_481a3d21c68396d6b180ab9795d" PRIMARY KEY ("userId", "organizationId")`);
        await queryRunner.query(`ALTER TABLE "user_organizations" DROP COLUMN "id"`);
        await queryRunner.query(`CREATE INDEX "IDX_71997faba4726730e91d514138" ON "user_organizations" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_11d4cd5202bd8914464f4bec37" ON "user_organizations" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_11d4cd5202bd8914464f4bec379" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_71997faba4726730e91d514138e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
