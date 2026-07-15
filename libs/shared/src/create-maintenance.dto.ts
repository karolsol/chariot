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
  @IsString({ message: "Selecting vehicle is required" })
  vehicleId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost!: number;

  @IsOptional()
  @IsUrl()
  invoiceLink?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;
}
