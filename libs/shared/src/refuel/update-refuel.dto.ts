import { FuelType } from "../common/fuel-type.enum.js";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class UpdateRefuelDto {
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fuelAmount!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fuelPrice!: number;

  @IsNotEmpty()
  fuelType!: FuelType;

  @IsOptional()
  gasStation?: string;

  @Min(0)
  mileageAtRefuel!: number;

  @IsOptional()
  invoiceLink?: string;
}
