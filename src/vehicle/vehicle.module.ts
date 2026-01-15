import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VehicleService } from "./vehicle.service";
import { VehicleController } from "./vehicle.controller";
import { Vehicle } from "./vehicle.entity";
import { UserModule } from "../user/user.module";
import { CaslModule } from "../casl/casl.module";

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), UserModule, CaslModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService, TypeOrmModule],
})
export class VehicleModule {}
