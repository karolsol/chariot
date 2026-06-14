import api from "./api.ts";
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import type { UpdateVehicleDto } from "@chariot/shared";
import type { CreateVehicleDto } from "@chariot/shared";
import type { VehicleStatsDto } from "@chariot/shared";

export const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await api.get<Vehicle[]>("/vehicles");
    return data;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const { data } = await api.get<Vehicle>(`/vehicles/${id}`);
    return data;
  },

  create: async (payload: CreateVehicleDto): Promise<Vehicle> => {
    const { data } = await api.post<Vehicle>("/vehicles", payload);
    return data;
  },

  update: async (id: string, payload: UpdateVehicleDto): Promise<Vehicle> => {
    const { data } = await api.put<Vehicle>(`/vehicles/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },

  stats: async (id: string): Promise<VehicleStatsDto> => {
    const { data } = await api.get<VehicleStatsDto>(`/vehicles/stats/${id}`);
    return data;
  },
};
