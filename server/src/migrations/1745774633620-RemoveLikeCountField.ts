import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLikeCountField1745774633620 implements MigrationInterface {
    name = 'RemoveLikeCountField1745774633620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "like_count"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "like_count" integer NOT NULL DEFAULT '0'`);
    }

}
