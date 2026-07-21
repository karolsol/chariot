import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class FilterRefuelDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vehicleId?: string;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;
}
