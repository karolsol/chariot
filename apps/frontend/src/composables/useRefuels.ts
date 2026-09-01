import { computed, type Ref } from "vue";
import {
  CreateRefuelDto,
  type IRefuel,
  UpdateRefuelDto,
} from "@chariot/shared";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { refuelService } from "../services/refuelService";
import type { PaginationState, SortingState } from "@tanstack/vue-table";

export function useRefuels(
  vehicle?: Ref<string | undefined>,
  date?: Ref<string | undefined>,
  pagination?: Ref<PaginationState | undefined>,
  sorting?: Ref<SortingState | undefined>,
) {
  const queryClient = useQueryClient();

  const queryKey = computed(() => [
    "refuels",
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
  } = useQuery<{ items: IRefuel[]; total: number }>({
    queryKey,
    queryFn: async () => {
      let fromDate: string | undefined = undefined;
      const dateVal = date?.value;

      if (dateVal && dateVal.trim() !== "" && !isNaN(Number(dateVal))) {
        const d = new Date();
        d.setDate(d.getDate() - Number(dateVal));
        fromDate = d.toISOString();
      }

      const sortConfig = sorting?.value?.[0];
      const result = await refuelService.getAll({
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

  const refuels = computed(() => response.value?.items ?? []);
  const total = computed(() => response.value?.total ?? 0);

  const pageCount = computed(() => {
    const size = pagination?.value?.pageSize ?? 10;
    return Math.ceil(total.value / size);
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRefuelDto) => refuelService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["refuels"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRefuelDto }) =>
      refuelService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["refuels"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => refuelService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["refuels"] });
    },
  });

  return {
    refuels,
    pageCount,
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
