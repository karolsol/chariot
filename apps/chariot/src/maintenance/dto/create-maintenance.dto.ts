import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from "class-validator";

export class CreateMaintenanceDto {
  @IsInt()
  vehicleId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost: number;

  @IsOptional()
  @IsUrl()
  invoiceLink?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;
}
