import { FuelType } from "#shared/fuel-type.enum";
import { IsDateString, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateRefuelDto {
  @IsOptional()
  @IsDateString()
  date?: string;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fuelAmount?: number;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fuelPrice?: number;
  @IsOptional()
  fuelType?: FuelType;
  @IsOptional()
  gasStation?: string;
  @IsOptional()
  mileageAtRefuel?: number;
  @IsOptional()
  invoiceLink?: string;
}
