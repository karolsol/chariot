import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class FilterRefuelDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vehicleId?: string;
  @IsOptional()
  @IsDateString()
  fromDate?: string;
}
