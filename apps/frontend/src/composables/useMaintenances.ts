import { computed, type Ref } from "vue";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { CreateMaintenanceDto, UpdateMaintenanceDto } from "@chariot/shared";
import { maintenanceService } from "../services/maintenanceService";
import type { PaginationState, SortingState } from "@tanstack/vue-table";

export function useMaintenances(
  vehicle?: Ref<string | undefined>,
  date?: Ref<string | undefined>,
  pagination?: Ref<PaginationState | undefined>,
  sorting?: Ref<SortingState | undefined>,
) {
  const queryClient = useQueryClient();
  const queryKey = computed(() => [
    "maintenances",
    vehicle?.value,
    date?.value,
    pagination?.value?.pageIndex,
    pagination?.value?.pageSize,
    sorting?.value?.[0]?.id,
    sorting?.value?.[0]?.desc,
  ]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      let fromDate: string | undefined = undefined;
      if (date && !isNaN(Number(date.value))) {
        const d = new Date();
        d.setDate(d.getDate() - Number(date.value));
        fromDate = d.toISOString();
      }
      const sortConfig = sorting?.value?.[0];
      const result = await maintenanceService.getAll({
        vehicleId: vehicle?.value,
        fromDate,
        page: (pagination?.value?.pageIndex ?? 0) + 1,
        limit: pagination?.value?.pageSize ?? 10,
        sortBy: sortConfig?.id,
        sortOrder: sortConfig?.desc ? "desc" : "asc",
      });

      return {
        items: result.items,
        total: result.total,
      };
    },
    placeholderData: keepPreviousData,
  });

  const maintenances = computed(() => response.value?.items ?? []);
  const total = computed(() => response.value?.total ?? 0);

  const pageCount = computed(() => {
    const size = pagination?.value?.pageSize ?? 10;
    return Math.ceil(total.value / size);
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateMaintenanceDto) =>
      maintenanceService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["maintenances"] });
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
      await queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => maintenanceService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    },
  });

  return {
    maintenances,
    pageCount,
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
