import api from "./api.ts";
import type {
  CreateMaintenanceDto,
  IMaintenance,
  UpdateMaintenanceDto,
} from "@chariot/shared";
import type { FilterMaintenanceDto } from "@chariot/shared";

export const maintenanceService = {
  getAll: async (filterDto: FilterMaintenanceDto): Promise<IMaintenance[]> => {
    const { data } = await api.get<IMaintenance[]>("/maintenances/", {
      params: filterDto,
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
