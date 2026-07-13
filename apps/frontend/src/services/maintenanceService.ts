import api from "./api.ts";
import type {
  CreateMaintenanceDto,
  IMaintenance,
  IVehicle,
  UpdateMaintenanceDto,
} from "@chariot/shared";

export const maintenanceService = {
  getAll: async (
    vehicle?: IVehicle,
    dataRange?: string,
  ): Promise<IMaintenance[]> => {
    const { data } = await api.get<IMaintenance[]>("/maintenances/", {
      params: {
        vehicleId: vehicle != undefined ? vehicle.id : {},
        dataRange: dataRange != undefined ? dataRange : {},
      },
    });
    return data;
  },

  getById: async (id: string): Promise<IMaintenance> => {
    const { data } = await api.get<IMaintenance>(`/maintenances/${id}`);
    return data;
  },

  create: async (payload: CreateMaintenanceDto): Promise<IMaintenance> => {
    const { data } = await api.post<IMaintenance>("/maintenances", payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateMaintenanceDto,
  ): Promise<IMaintenance> => {
    const { data } = await api.put<IMaintenance>(
      `/maintenances/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/maintenances/${id}`);
  },
};
