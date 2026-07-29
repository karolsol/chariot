<script setup lang="ts">
import MaintenanceTableRow from "../components/MaintenanceTableRow.vue";
import { ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import ConfirmationPopup from "../components/modals/ConfirmationPopup.vue";
import { useModalStore } from "../stores/modalStore.ts";
import EditMaintenanceModal from "../components/modals/EditMaintenanceModal.vue";
import {
  CreateMaintenanceDto,
  type IMaintenance,
  type UpdateMaintenanceDto,
} from "@chariot/shared";
import AddMaintenanceModal from "../components/modals/AddMaintenanceModal.vue";
import { Icon } from "@iconify/vue";
import { useVehicles } from "../composables/useVehicles.ts";
import { useMaintenances } from "../composables/useMaintenances.ts";
import FetchingErrorCard from "../components/FetchingErrorCard.vue";

const selectedMaintenance = ref<IMaintenance>({} as IMaintenance);

const vehicleFilter = ref<string | undefined>();
const dateRangeFilter = ref<string | undefined>();

const { vehicles } = useVehicles();
const {
  maintenances,
  isLoading,
  isError,
  addMaintenance,
  editMaintenance,
  removeMaintenance,
} = useMaintenances(vehicleFilter, dateRangeFilter);

const modalStore = useModalStore();

const onCreate = () => {
  modalStore.open(AddMaintenanceModal, {
    props: {
      vehicles: vehicles.value,
    },
    functions: {
      submit: (createMaintenanceDto: CreateMaintenanceDto) => {
        addMaintenance(createMaintenanceDto);
        modalStore.close();
      },
    },
  });
};
const onEdit = (id: string) => {
  selectedMaintenance.value = maintenances.value!.find(
    (v) => v.id === id,
  ) as IMaintenance;
  modalStore.open(EditMaintenanceModal, {
    props: {
      maintenance: selectedMaintenance.value,
      vehicles: vehicles.value,
    },
    functions: {
      submit: (id: string, refuel: UpdateMaintenanceDto) => {
        editMaintenance({ id, payload: refuel });
        modalStore.close();
      },
    },
  });
};

const onDelete = (id: string) => {
  const foundRefuel = maintenances.value?.find((v) => v.id === id);
  if (!foundRefuel) return;

  selectedMaintenance.value = foundRefuel;

  modalStore.open(ConfirmationPopup, {
    props: {
      title: "Delete maintenance",
      message: `Are you sure you want to delete the ${selectedMaintenance.value.title} from ${new Date(selectedMaintenance.value.date).toLocaleDateString()}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      icon: "bi:exclamation-triangle-fill",
      variant: "danger",
    },
    functions: {
      submit: () => {
        removeMaintenance(selectedMaintenance.value.id);
        modalStore.close();
      },
    },
  });
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your maintenance:</h2>
        <div class="row g-3 mb-4 align-items-end">
          <div class="col-6 col-md-3">
            <label for="vehicleFilter" class="form-label small text-muted"
              >Vehicle</label
            >
            <select
              class="form-select"
              id="vehicleFilter"
              v-model="vehicleFilter"
            >
              <option :value="undefined" selected>All</option>
              <option
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                :value="vehicle.id"
              >
                {{ vehicle.make }} {{ vehicle.model }}
              </option>
            </select>
          </div>

          <div class="col-6 col-md-3">
            <label for="dateRange" class="form-label small text-muted"
              >Date Range</label
            >
            <select
              class="form-select"
              id="dateRange"
              v-model="dateRangeFilter"
            >
              <option :value="undefined" selected>All</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="365">Last Year</option>
            </select>
          </div>

          <div class="col-12 col-md-6 d-grid d-md-flex justify-content-md-end">
            <button
              class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2"
              type="button"
              @click="onCreate"
            >
              <Icon icon="mdi:plus" width="18" height="18" />
              Add new entry
            </button>
          </div>
        </div>
        <h4>Maintenance Overview</h4>
        <div v-if="isLoading" class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <FetchingErrorCard v-else-if="isError" />
        <template v-else>
          <template
            class="table-responsive"
            v-if="maintenances && maintenances.length > 0"
          >
            <table class="table table-striped table-hover">
              <thead class="table-primary">
                <tr>
                  <th>Vehicle</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Mileage</th>
                  <th>Cost</th>
                  <th>Invoice</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <MaintenanceTableRow
                  v-for="maintenance in maintenances"
                  :key="maintenance.id"
                  :maintenance="maintenance"
                  @edit="onEdit"
                  @delete="onDelete"
                />
              </tbody>
            </table>
          </template>
          <NoEntitiesCard
            main-text="No maintenances found"
            secondary-text="You haven't added any maintenances yet."
            v-else
          />
        </template>
      </div>
    </div>
  </div>
</template>
