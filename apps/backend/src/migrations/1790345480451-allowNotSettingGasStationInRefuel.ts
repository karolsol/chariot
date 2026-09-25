import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowNotSettingGasStationInRefuel1790345480451 implements MigrationInterface {
    name = 'AllowNotSettingGasStationInRefuel1790345480451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refuel" ALTER COLUMN "gasStation" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refuel" ALTER COLUMN "gasStation" SET NOT NULL`);
    }

}
