import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1771273665890 implements MigrationInterface {
    name = 'Initial1771273665890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "vin" character varying NOT NULL, "registrationNumber" character varying NOT NULL, "make" character varying NOT NULL, "model" character varying NOT NULL, "year" integer NOT NULL, "initialMileage" integer NOT NULL, "vehicleType" integer NOT NULL, "fuelType" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refuel" ("id" SERIAL NOT NULL, "vehicleId" integer NOT NULL, "date" TIMESTAMP NOT NULL, "fuelAmount" double precision NOT NULL, "fuelPrice" double precision NOT NULL, "fuelType" integer NOT NULL, "gasStation" character varying NOT NULL, "mileageAtRefuel" integer NOT NULL, "invoiceLink" character varying, CONSTRAINT "PK_8d23c66179e5902d921e215ce56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "maintenance" ("id" SERIAL NOT NULL, "vehicleId" integer NOT NULL, "title" character varying NOT NULL, "description" character varying, "date" TIMESTAMP NOT NULL, "cost" double precision NOT NULL, "invoiceLink" character varying, "mileage" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_542fb6a28537140d2df95faa52a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refuel" ADD CONSTRAINT "FK_7ff5b5b69871c3f6c0673d24dd4" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "FK_27efd8ad51aa9597785360b984d" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "maintenance" ADD CONSTRAINT "FK_724107291aec48826a8ffe8eaa9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "FK_724107291aec48826a8ffe8eaa9"`);
        await queryRunner.query(`ALTER TABLE "maintenance" DROP CONSTRAINT "FK_27efd8ad51aa9597785360b984d"`);
        await queryRunner.query(`ALTER TABLE "refuel" DROP CONSTRAINT "FK_7ff5b5b69871c3f6c0673d24dd4"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1"`);
        await queryRunner.query(`DROP TABLE "maintenance"`);
        await queryRunner.query(`DROP TABLE "refuel"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
