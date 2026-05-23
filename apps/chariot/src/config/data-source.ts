import { DataSource } from "typeorm";
import type { DataSourceOptions } from "typeorm";
import { User } from "../user/user.entity";
import { Maintenance } from "../maintenance/maintenance.entity";
import { Refuel } from "../refuel/refuel.entity";
import { Vehicle } from "../vehicle/vehicle.entity";
import { RefreshToken } from "../auth/refresh-token.entity";
import { InnitialMigration1777895412351 } from "../migrations/1777895412351-innitialMigration";
import { AddRefreshTokenEntity1777977704186 } from "../migrations/1777977704186-addRefreshTokenEntity";


declare const __dirname: string;

export const createDataSourceOptions = (): DataSourceOptions => ({
  type: "postgres",
  host: process.env.DB_HOST ?? "postgres",
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
  username: process.env.DB_USERNAME ?? "admin",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "chariot-dev",
  synchronize: false,
  entities: [User, Maintenance, Refuel, Vehicle, RefreshToken],
  migrations: [InnitialMigration1777895412351, AddRefreshTokenEntity1777977704186],
});

export const AppDataSource = new DataSource(createDataSourceOptions());
