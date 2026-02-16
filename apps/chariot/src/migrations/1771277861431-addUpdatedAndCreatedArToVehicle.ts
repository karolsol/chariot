import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAndCreatedArToVehicle1771277861431 implements MigrationInterface {
    name = 'AddUpdatedAndCreatedArToVehicle1771277861431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "created_at"`);
    }

}
