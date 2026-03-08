import * as process from "node:process";

export const jwtConstants = {
  secret: process.env.JWT_SECRET || "defaultSecretKey",
  expiresIn: 900,
  refreshSecret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecretKey",
  refreshExpiresIn: 604800,
};
