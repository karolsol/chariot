import { DataSource } from "typeorm";
import type { DataSourceOptions } from "typeorm";
import { User } from "../user/user.entity";
import { Maintenance } from "../maintenance/maintenance.entity";
import { Refuel } from "../refuel/refuel.entity";
import { Vehicle } from "../vehicle/vehicle.entity";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "password",
  database: "chariot-dev",
  synchronize: false,
  entities: [User, Maintenance, Refuel, Vehicle],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
};
export const AppDataSource = new DataSource(dataSourceOptions);
