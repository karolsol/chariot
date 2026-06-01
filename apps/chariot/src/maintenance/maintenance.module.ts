import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MaintenanceService } from "./maintenance.service";
import { MaintenanceController } from "./maintenance.controller";
import { Maintenance } from "./maintenance.entity";
import { VehicleModule } from "../vehicle/vehicle.module";
import { CaslModule } from "../casl/casl.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Maintenance]),
    forwardRef(() => VehicleModule),
    UserModule,
    CaslModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService, TypeOrmModule],
})
export class MaintenanceModule {}
