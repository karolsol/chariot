import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class FilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vehicleId?: string;
  @IsOptional()
  @IsDateString()
  fromDate?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  page?: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  @IsString()
  sortOrder?: "asc" | "desc";
}
