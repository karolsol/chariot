import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { vehicleService } from "../services/vehiclesService";
import {
  type UpdateVehicleDto,
  type CreateVehicleDto,
  VehicleType,
  FuelType,
} from "@chariot/shared";
import type { Ref } from "vue";

export function useVehicles(
  vehicleType?: Ref<VehicleType | undefined>,
  fuelType?: Ref<FuelType | undefined>,
) {
  const queryClient = useQueryClient();
  const VEHICLES_KEY = ["vehicles", vehicleType, fuelType] as const;

  const {
    data: vehicles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: VEHICLES_KEY,
    queryFn: () =>
      vehicleService.getAll({
        vehicleType: vehicleType?.value,
        fuelType: fuelType?.value,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateVehicleDto) => vehicleService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVehicleDto }) =>
      vehicleService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });

  return {
    vehicles,
    isLoading,
    isError,
    error,

    addVehicle: createMutation.mutate,
    isAdding: createMutation.isPending,

    editVehicle: updateMutation.mutate,
    isEditing: updateMutation.isPending,

    removeVehicle: deleteMutation.mutate,
    isRemoving: deleteMutation.isPending,
  };
}
