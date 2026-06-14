import { IsEnum, IsInt, IsString } from "class-validator";
import { VehicleType } from "./vehicle-type.enum.js";
import { FuelType } from "./fuel-type.enum.js";

export class CreateVehicleDto {
  @IsString()
  vin!: string;

  @IsString()
  registrationNumber!: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  year!: number;

  @IsInt()
  initialMileage!: number;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @IsEnum(FuelType)
  fuelType!: FuelType;
}
