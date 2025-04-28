import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewcountAndImageUrl1745742057725 implements MigrationInterface {
    name = 'AddViewcountAndImageUrl1745742057725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "view_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "view_count"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "imageUrl"`);
    }

}
