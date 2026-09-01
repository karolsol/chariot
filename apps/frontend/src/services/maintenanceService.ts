import api from "./api";
import {
  type CreateMaintenanceDto,
  FilterDto,
  type IMaintenance,
  type UpdateMaintenanceDto,
} from "@chariot/shared";

export const maintenanceService = {
  getAll: async (
    filterDto: FilterDto,
  ): Promise<{ items: IMaintenance[]; total: number }> => {
    const { data } = await api.get<{ items: IMaintenance[]; total: number }>(
      "/maintenances/",
      {
        params: filterDto,
      },
    );
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
