import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectCascade1731060796797 implements MigrationInterface {
    name = 'ProjectCascade1731060796797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_aplication" DROP CONSTRAINT "FK_4420a4788a23812d1fddba958eb"`);
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4"`);
        await queryRunner.query(`ALTER TABLE "karma" DROP CONSTRAINT "FK_2b941d0fe4e031084ab1a5b34e9"`);
        await queryRunner.query(`ALTER TABLE "project_requirment" DROP CONSTRAINT "FK_d5adc384cc3c2e52ea89d60e45c"`);
        await queryRunner.query(`ALTER TABLE "project_aplication" ADD CONSTRAINT "FK_4420a4788a23812d1fddba958eb" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "karma" ADD CONSTRAINT "FK_2b941d0fe4e031084ab1a5b34e9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_requirment" ADD CONSTRAINT "FK_d5adc384cc3c2e52ea89d60e45c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_requirment" DROP CONSTRAINT "FK_d5adc384cc3c2e52ea89d60e45c"`);
        await queryRunner.query(`ALTER TABLE "karma" DROP CONSTRAINT "FK_2b941d0fe4e031084ab1a5b34e9"`);
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4"`);
        await queryRunner.query(`ALTER TABLE "project_aplication" DROP CONSTRAINT "FK_4420a4788a23812d1fddba958eb"`);
        await queryRunner.query(`ALTER TABLE "project_requirment" ADD CONSTRAINT "FK_d5adc384cc3c2e52ea89d60e45c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "karma" ADD CONSTRAINT "FK_2b941d0fe4e031084ab1a5b34e9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_aplication" ADD CONSTRAINT "FK_4420a4788a23812d1fddba958eb" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
