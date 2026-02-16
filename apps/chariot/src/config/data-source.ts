import { DataSource } from "typeorm";
import type { DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "password",
  database: "chariot-dev",
  synchronize: false,
  entities: [__dirname + "../../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
};

export const AppDataSource = new DataSource(dataSourceOptions);
