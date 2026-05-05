import { FuelType } from "#shared/fuel-type.enum";
import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class UpdateRefuelDto {
  @IsOptional()
  @IsDateString()
  date: string;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  fuelAmount: number;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  fuelPrice: number;
  @IsOptional()
  fuelType: FuelType;
  @IsOptional()
  gasStation: string;
  @IsOptional()
  mileageAtRefuel: number;
  @IsOptional()
  invoiceLink: string;
}
