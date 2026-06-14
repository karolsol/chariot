import { IVehicle } from "./vehicle.interface.js";
import { IUser } from "./user.interface.js";

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
  Vehicle: IVehicle;
  user: IUser;
}
