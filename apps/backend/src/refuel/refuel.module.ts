import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefuelService } from "./refuel.service";
import { RefuelController } from "./refuel.controller";
import { Refuel } from "./refuel.entity";
import { VehicleModule } from "../vehicle/vehicle.module";
import { UserModule } from "../user/user.module";
import { CaslModule } from "../casl/casl.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Refuel]),
    forwardRef(() => VehicleModule),
    UserModule,
    CaslModule,
  ],
  controllers: [RefuelController],
  providers: [RefuelService],
  exports: [RefuelService, TypeOrmModule],
})
export class RefuelModule {}
