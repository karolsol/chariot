import api from "./api.ts";
import type { IVehicle, UpdateVehicleDto } from "@chariot/shared";
import type { CreateVehicleDto } from "@chariot/shared";
import type { VehicleStatsDto } from "@chariot/shared";

export const vehicleService = {
  getAll: async (): Promise<IVehicle[]> => {
    const { data } = await api.get<IVehicle[]>("/vehicles");
    return data;
  },

  getById: async (id: string): Promise<IVehicle> => {
    const { data } = await api.get<IVehicle>(`/vehicles/${id}`);
    return data;
  },

  create: async (payload: CreateVehicleDto): Promise<IVehicle> => {
    const { data } = await api.post<IVehicle>("/vehicles", payload);
    return data;
  },

  update: async (id: string, payload: UpdateVehicleDto): Promise<IVehicle> => {
    const { data } = await api.put<IVehicle>(`/vehicles/${id}`, payload);
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
