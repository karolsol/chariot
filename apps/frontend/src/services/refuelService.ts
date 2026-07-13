import api from "./api.ts";
import type { CreateRefuelDto, IRefuel, IVehicle } from "@chariot/shared";
import type { UpdateRefuelDto } from "@chariot/shared";

export const refuelService = {
  getAll: async (
    vehicle?: IVehicle,
    dataRange?: string,
  ): Promise<IRefuel[]> => {
    const { data } = await api.get<IRefuel[]>("/refuels", {
      params: {
        vehicleId: vehicle != undefined ? vehicle.id : {},
        dataRange: dataRange != undefined ? dataRange : {},
      },
    });
    return data;
  },

  getById: async (id: string): Promise<IRefuel> => {
    const { data } = await api.get<IRefuel>(`/refuels/${id}`);
    return data;
  },

  create: async (payload: CreateRefuelDto): Promise<IRefuel> => {
    const { data } = await api.post<IRefuel>("/refuels", payload);
    return data;
  },

  update: async (id: string, payload: UpdateRefuelDto): Promise<IRefuel> => {
    const { data } = await api.put<IRefuel>(`/refuels/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/refuels/${id}`);
  },
};
