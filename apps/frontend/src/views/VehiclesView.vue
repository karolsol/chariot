<script setup lang="ts">
import VehicleCard from "../components/VehicleCard.vue";
import { ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import { vehicleService } from "../services/vehiclesService";
import {
  type CreateVehicleDto,
  FuelType,
  type IVehicle,
  VehicleType,
} from "@chariot/shared";
import AddVehicleModal from "../components/modals/AddVehicleModal.vue";
import EditVehicleModal from "../components/modals/EditVehicleModal.vue";
import type { UpdateVehicleDto } from "@chariot/shared";
import VehicleTypeSelector from "../components/VehicleTypeSelector.vue";
import FuelTypeSelector from "../components/FuelTypeSelector.vue";
import StatsVehicleModal from "../components/modals/StatsVehicleModal.vue";
import { useModalStore } from "../stores/modalStore";
import ConfirmationPopup from "../components/modals/ConfirmationPopup.vue";
import { Icon } from "@iconify/vue";
import { useVehicles } from "../composables/useVehicles";
import FetchingErrorCard from "../components/FetchingErrorCard.vue";

const modalStore = useModalStore();

const selectedVehicle = ref<IVehicle>({} as IVehicle);

const vehicleTypeFilter = ref<VehicleType | undefined>();

const fuelTypeFilter = ref<FuelType | undefined>();
const { vehicles, isLoading, isError, addVehicle, editVehicle, removeVehicle } =
  useVehicles(vehicleTypeFilter, fuelTypeFilter);
const onCreate = () => {
  modalStore.open(AddVehicleModal, {
    functions: {
      submit: (createVehicleDto: CreateVehicleDto) => {
        addVehicle(createVehicleDto);
        modalStore.close();
      },
    },
  });
};
const onEdit = (vehicle: IVehicle) => {
  selectedVehicle.value = vehicle;
  modalStore.open(EditVehicleModal, {
    props: {
      vehicle: selectedVehicle.value,
    },
    functions: {
      submit: (id: string, updatedData: UpdateVehicleDto) => {
        editVehicle({ id, payload: updatedData });
        modalStore.close();
      },
    },
  });
};

const onDelete = (id: string) => {
  const foundVehicle = vehicles.value?.find((v) => v.id === id);
  if (!foundVehicle) return;

  selectedVehicle.value = foundVehicle;

  modalStore.open(ConfirmationPopup, {
    props: {
      title: "Delete vehicle",
      message: `Are you sure you want to delete the ${selectedVehicle.value.make} ${selectedVehicle.value.model}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      icon: "bi:exclamation-triangle-fill",
      variant: "danger",
    },
    functions: {
      submit: () => {
        removeVehicle(selectedVehicle.value.id);
        modalStore.close();
      },
    },
  });
};

const onStats = (id: string) => {
  void vehicleService.stats(id).then((stats) => {
    modalStore.open(StatsVehicleModal, {
      props: {
        stats: stats,
      },
    });
  });
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your vehicles:</h2>
        <div class="row mb-4 align-items-end">
          <div class="col-6 col-md-3">
            <VehicleTypeSelector v-model="vehicleTypeFilter" />
          </div>
          <div class="col-6 col-md-3">
            <FuelTypeSelector v-model="fuelTypeFilter" />
          </div>
          <div class="col-12 col-md-6 d-grid d-md-flex justify-content-md-end">
            <button
              class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2"
              type="button"
              @click="onCreate"
            >
              <Icon
                icon="mdi:plus"
                width="18"
                height="18"
              />
              Add new entry
            </button>
          </div>
        </div>
        <div
          id="vehiclesCards"
          class="row g-4 mt-4"
        >
          <div
            v-if="isLoading"
            class="col-12 text-center py-5"
          >
            <div
              class="spinner-border text-primary"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <FetchingErrorCard v-else-if="isError" />
          <template v-else>
            <template v-if="vehicles && vehicles.length > 0">
              <div
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                class="col-md-4"
              >
                <VehicleCard
                  :vehicle="vehicle"
                  @edit="onEdit"
                  @delete="onDelete"
                  @stats="onStats"
                />
              </div>
            </template>
            <NoEntitiesCard
              v-else
              main-text="No vehicles found"
              secondary-text="You haven't added any vehicles to your garage yet."
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
