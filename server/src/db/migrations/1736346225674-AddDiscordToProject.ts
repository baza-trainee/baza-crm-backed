import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDiscordToProject1736346225674 implements MigrationInterface {
    name = 'AddDiscordToProject1736346225674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "discord" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "discord"`);
    }

}
