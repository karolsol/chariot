import type { Ref } from "vue";
import { CreateRefuelDto, UpdateRefuelDto } from "@chariot/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { refuelService } from "../services/refuelService.ts";

export function useRefuels(
  vehicle?: Ref<string | undefined>,
  date?: Ref<string | undefined>,
) {
  const queryClient = useQueryClient();
  const REFUELS_KEY = ["refuels", vehicle, date] as const;

  const {
    data: refuels,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: REFUELS_KEY,
    queryFn: async () => {
      let fromDate: string | undefined = undefined;
      if (date && !isNaN(Number(date.value))) {
        const d = new Date();
        d.setDate(d.getDate() - Number(date.value));
        fromDate = d.toISOString();
      }
      return await refuelService.getAll({
        vehicleId: vehicle?.value,
        fromDate: fromDate,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRefuelDto) => refuelService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: REFUELS_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRefuelDto }) =>
      refuelService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: REFUELS_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => refuelService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: REFUELS_KEY });
    },
  });

  return {
    refuels,
    isLoading,
    isError,
    error,

    addRefuel: createMutation.mutate,
    isAdding: createMutation.isPending,

    editRefuel: updateMutation.mutate,
    isEditing: updateMutation.isPending,

    removeRefuel: deleteMutation.mutate,
    isRemoving: deleteMutation.isPending,
  };
}
