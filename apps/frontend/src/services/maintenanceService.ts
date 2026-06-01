import api from "./api.ts";
import type { Maintenance } from "../../../chariot/src/maintenance/maintenance.entity.ts";
import type { CreateMaintenanceDto } from "../../../../libs/shared/src/create-maintenance.dto.ts";
import type { UpdateMaintenanceDto } from "../../../../libs/shared/src/update-maintenance.dto.ts";

export const maintenanceService = {
  getAll: async (): Promise<Maintenance[]> => {
    const { data } = await api.get<Maintenance[]>("/maintenances/");
    return data;
  },

  getById: async (id: string): Promise<Maintenance> => {
    const { data } = await api.get<Maintenance>(`/maintenances/${id}`);
    return data;
  },

  create: async (payload: CreateMaintenanceDto): Promise<Maintenance> => {
    const { data } = await api.post<Maintenance>("/maintenances", payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateMaintenanceDto,
  ): Promise<Maintenance> => {
    const { data } = await api.put<Maintenance>(`/maintenances/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/maintenances/${id}`);
  },
};
