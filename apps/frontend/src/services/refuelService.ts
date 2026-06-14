import api from "./api.ts";
import type { Refuel } from "../../../chariot/src/refuel/refuel.entity.ts";
import type { CreateRefuelDto } from "@chariot/shared";
import type { UpdateRefuelDto } from "@chariot/shared";

export const refuelService = {
  getAll: async (): Promise<Refuel[]> => {
    const { data } = await api.get<Refuel[]>("/refuels");
    return data;
  },

  getById: async (id: string): Promise<Refuel> => {
    const { data } = await api.get<Refuel>(`/refuels/${id}`);
    return data;
  },

  create: async (payload: CreateRefuelDto): Promise<Refuel> => {
    const { data } = await api.post<Refuel>("/refuels", payload);
    return data;
  },

  update: async (id: string, payload: UpdateRefuelDto): Promise<Refuel> => {
    const { data } = await api.put<Refuel>(`/refuels/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/refuels/${id}`);
  },
};
