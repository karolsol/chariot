import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateMaintenanceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  cost?: number;

  @IsOptional()
  invoiceLink?: string;

  @IsOptional()
  @IsInt()
  mileage?: number;
}
