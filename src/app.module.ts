import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-aut.guard";
import { CaslModule } from "./casl/casl.module";
import { VehicleModule } from "./vehicle/vehicle.module";
import { RefuelModule } from "./refuel/refuel.module";
import { MaintenanceModule } from "./maintenance/maintenance.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/",
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "admin",
      password: "password",
      database: "chariot-dev",
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    CaslModule,
    VehicleModule,
    RefuelModule,
    MaintenanceModule,
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
