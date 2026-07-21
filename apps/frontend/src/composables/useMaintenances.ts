import type { Ref } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { CreateMaintenanceDto, UpdateMaintenanceDto } from "@chariot/shared";
import { maintenanceService } from "../services/maintenanceService.ts";

export function useMaintenances(
  vehicle?: Ref<string | undefined>,
  date?: Ref<string | undefined>,
) {
  const queryClient = useQueryClient();
  const MAINTENANCES_KEY = ["maintenances", vehicle, date] as const;

  const {
    data: maintenances,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: MAINTENANCES_KEY,
    queryFn: async () => {
      let fromDate: string | undefined = undefined;
      if (date && !isNaN(Number(date.value))) {
        const d = new Date();
        d.setDate(d.getDate() - Number(date.value));
        fromDate = d.toISOString();
      }
      return await maintenanceService.getAll({
        vehicleId: vehicle?.value,
        fromDate: fromDate,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateMaintenanceDto) =>
      maintenanceService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MAINTENANCES_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMaintenanceDto;
    }) => {
      return maintenanceService.update(id, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MAINTENANCES_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => maintenanceService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MAINTENANCES_KEY });
    },
  });

  return {
    maintenances,
    isLoading,
    isError,
    error,

    addMaintenance: createMutation.mutate,
    isAdding: createMutation.isPending,

    editMaintenance: updateMutation.mutate,
    isEditing: updateMutation.isPending,

    removeMaintenance: deleteMutation.mutate,
    isRemoving: deleteMutation.isPending,
  };
}
