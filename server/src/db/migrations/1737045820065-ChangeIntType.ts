import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIntType1737045820065 implements MigrationInterface {
    name = 'ChangeIntType1737045820065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "karmaPoints"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "karmaPoints" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "karmaPoints"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "karmaPoints" integer`);
    }

}
