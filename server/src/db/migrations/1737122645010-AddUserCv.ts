import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserCv1737122645010 implements MigrationInterface {
    name = 'AddUserCv1737122645010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "cv_link" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cv_link"`);
    }

}
