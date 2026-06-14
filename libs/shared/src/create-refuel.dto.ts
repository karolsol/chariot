import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from "class-validator";
import { FuelType } from "./fuel-type.enum.js";

export class CreateRefuelDto {
  @IsString()
  vehicleId!: string;

  @IsDateString()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fuelAmount!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fuelPrice!: number;

  @IsEnum(FuelType)
  fuelType!: FuelType;

  @IsString()
  gasStation!: string;

  @IsInt()
  @Min(0)
  mileageAtRefuel!: number;

  @IsOptional()
  @IsUrl()
  invoiceLink?: string;
}
