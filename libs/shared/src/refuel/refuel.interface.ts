import { FuelType } from "../common/fuel-type.enum.js";
import { IVehicle } from "../vehicle/vehicle.interface.js";

export interface IRefuel {
  id: string;
  vehicleId: string;
  date: Date | string;
  fuelAmount: number;
  fuelPrice: number;
  fuelType: FuelType;
  gasStation?: string | null;
  mileageAtRefuel: number;
  invoiceLink?: string | null;
  vehicle: IVehicle;
}
