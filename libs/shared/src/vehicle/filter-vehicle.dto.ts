import { VehicleType } from "./vehicle-type.enum.js";
import { FuelType } from "../common/fuel-type.enum.js";
import { IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class FilterVehicleDto {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;
  @IsOptional()
  @Type(() => Number)
  @IsEnum(FuelType)
  fuelType?: FuelType;
}
