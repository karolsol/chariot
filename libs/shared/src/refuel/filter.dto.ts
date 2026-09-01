import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

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
  @Type(() => Number)
  page?: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  @IsString()
  sortOrder?: "asc" | "desc";
}
