import { VehicleType } from "./vehicle-type.enum.js";
import { FuelType } from "../common/fuel-type.enum.js";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class FilterVehicleDto {
  @IsOptional()
  @IsEnum(VehicleType)
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  vehicleType?: VehicleType;

  @IsOptional()
  @IsEnum(FuelType)
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  fuelType?: FuelType;
}
