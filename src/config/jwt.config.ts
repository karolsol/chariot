import * as process from "node:process";

export const jwtConstants = {
  secret: process.env.JWT_SECRET || "defaultSecretKey",
  expiresIn: 1200,
};
