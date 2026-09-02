import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-aut.guard";
import { CaslModule } from "./casl/casl.module";
import { VehicleModule } from "./vehicle/vehicle.module";
import { RefuelModule } from "./refuel/refuel.module";
import { MaintenanceModule } from "./maintenance/maintenance.module";
import { createDataSourceOptions } from "./config/data-source";

@Module({
  imports: [
    UserModule,
    AuthModule,
    CaslModule,
    VehicleModule,
    RefuelModule,
    MaintenanceModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => createDataSourceOptions(),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
