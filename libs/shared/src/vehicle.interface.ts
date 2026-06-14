import { VehicleType } from "./vehicle-type.enum.js";
import { FuelType } from "./fuel-type.enum.js";
import { IUser } from "./user.interface.js";

export interface IVehicle {
  id: string;
  vin: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  initialMileage: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  userId: string;
  created_at: Date;
  updated_at: Date;
  user: IUser;
}