import { IsEnum, IsInt, IsString } from "class-validator";
import { VehicleType } from "./vehicle-type.enum";
import { FuelType } from "#shared/fuel-type.enum";

export class CreateVehicleDto {
  @IsString()
  vin: string;

  @IsString()
  registrationNumber: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

  @IsInt()
  initialMileage: number;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsEnum(FuelType)
  fuelType: FuelType;
}
