import { IVehicle } from "../vehicle/vehicle.interface.js";
import { IUser } from "../user/user.interface.js";

export interface IMaintenance {
  id: string;
  vehicleId: string;
  title: string;
  description?: string;
  date: Date | string;
  cost: number;
  invoiceLink?: string;
  mileage: number;
  userId: string;
  vehicle: IVehicle;
  user: IUser;
}
