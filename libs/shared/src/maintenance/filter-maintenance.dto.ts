import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class FilterMaintenanceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vehicleId?: string;
  @IsOptional()
  @IsDateString()
  fromDate?: string;
}
