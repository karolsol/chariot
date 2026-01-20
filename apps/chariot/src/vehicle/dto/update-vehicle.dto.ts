import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { VehicleType } from "../vehicle-type.enum";
import { FuelType } from "../../common/fuel-type.enum";

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  vin: string;

  @IsString()
  @IsOptional()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  make: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsInt()
  @IsOptional()
  year: number;

  @IsInt()
  @IsOptional()
  initialMileage: number;

  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType: VehicleType;

  @IsEnum(FuelType)
  @IsOptional()
  fuelType: FuelType;
}
