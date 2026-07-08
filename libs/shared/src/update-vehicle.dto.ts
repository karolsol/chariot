import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { VehicleType } from "./vehicle-type.enum.js";
import { FuelType } from "./fuel-type.enum.js";

export class UpdateVehicleDto {
  @IsString()
  @IsNotEmpty()
  vin!: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber!: string;

  @IsString()
  @IsNotEmpty()
  make!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsInt()
  year!: number;

  @IsInt()
  @Min(0)
  initialMileage!: number;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  vehicleType!: VehicleType;

  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType!: FuelType;
}
