import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdsToUuidv71777641098623 implements MigrationInterface {
    name = 'ChangeIdsToUuidv71777641098623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "FK_724107291aec48826a8ffe8eaa9"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "FK_27efd8ad51aa9597785360b984d"`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP CONSTRAINT "FK_7ff5b5b69871c3f6c0673d24dd4"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "PK_542fb6a28537140d2df95faa52a"`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "PK_542fb6a28537140d2df95faa52a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD "vehicleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP CONSTRAINT "PK_8d23c66179e5902d921e215ce56"`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD CONSTRAINT "PK_8d23c66179e5902d921e215ce56" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD "vehicleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "FK_27efd8ad51aa9597785360b984d" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "FK_724107291aec48826a8ffe8eaa9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD CONSTRAINT "FK_7ff5b5b69871c3f6c0673d24dd4" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refuel" DROP CONSTRAINT "FK_7ff5b5b69871c3f6c0673d24dd4"`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "FK_724107291aec48826a8ffe8eaa9"`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "FK_27efd8ad51aa9597785360b984d"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1"`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD "vehicleId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP CONSTRAINT "PK_8d23c66179e5902d921e215ce56"`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD CONSTRAINT "PK_8d23c66179e5902d921e215ce56" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD "vehicleId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "PK_542fb6a28537140d2df95faa52a"`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "PK_542fb6a28537140d2df95faa52a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD CONSTRAINT "FK_7ff5b5b69871c3f6c0673d24dd4" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "FK_27efd8ad51aa9597785360b984d" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "FK_724107291aec48826a8ffe8eaa9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
