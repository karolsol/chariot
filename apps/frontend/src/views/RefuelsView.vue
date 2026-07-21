<script setup lang="ts">
import { ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import ConfirmationPopup from "../components/modals/ConfirmationPopup.vue";
import { useModalStore } from "../stores/modalStore.ts";
import RefuelTableRow from "../components/RefuelTableRow.vue";
import AddRefuelModal from "../components/modals/AddRefuelModal.vue";
import EditRefuelModal from "../components/modals/EditRefuelModal.vue";
import {
  CreateRefuelDto,
  type IRefuel,
  type UpdateRefuelDto,
} from "@chariot/shared";
import { Icon } from "@iconify/vue";
import { useVehicles } from "../composables/useVehicles.ts";
import { useRefuels } from "../composables/useRefuels.ts";

const selectedRefuel = ref<IRefuel>({} as IRefuel);

const vehicleFilter = ref<string | undefined>();
const dateRangeFilter = ref<string | undefined>();

const modalStore = useModalStore();

const { vehicles } = useVehicles();

const { refuels, isLoading, isError, addRefuel, editRefuel, removeRefuel } =
  useRefuels(vehicleFilter, dateRangeFilter);

const onCreate = () => {
  modalStore.open(AddRefuelModal, {
    props: {
      vehicles: vehicles.value,
    },
    functions: {
      submit: (createRefuelDto: CreateRefuelDto) => {
        addRefuel(createRefuelDto);
        modalStore.close();
      },
    },
  });
};
const onEdit = (id: string) => {
  selectedRefuel.value = refuels.value!.find((v) => v.id === id) as IRefuel;
  modalStore.open(EditRefuelModal, {
    props: {
      refuel: selectedRefuel.value,
      vehicles: vehicles.value,
    },
    functions: {
      submit: (id: string, refuel: UpdateRefuelDto) => {
        editRefuel({ id, payload: refuel });
        modalStore.close();
      },
    },
  });
};

const onDelete = (id: string) => {
  const foundRefuel = refuels.value?.find((v) => v.id === id);
  if (!foundRefuel) return;

  selectedRefuel.value = foundRefuel;

  modalStore.open(ConfirmationPopup, {
    props: {
      title: "Delete refuel",
      message: `Are you sure you want to delete the ${selectedRefuel.value.vehicle.make} ${selectedRefuel.value.vehicle.model} from ${new Date(selectedRefuel.value.date).toLocaleDateString()}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      icon: "bi:exclamation-triangle-fill",
      variant: "danger",
    },
    functions: {
      submit: () => {
        removeRefuel(selectedRefuel.value.id);
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
        <h2>Your refuels:</h2>
        <div class="row g-3 mb-4 align-items-end">
          <div class="col-6 col-md-3">
            <label for="vehicleFilter" class="form-label small text-muted"
              >Vehicle</label
            >
            <select
              class="form-select form-select-sm"
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
              class="form-select form-select-sm"
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
        <h4>Refueling Overview</h4>
        <div v-if="isLoading" class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="isError" class="col-12 text-center text-danger py-5">
          Something went wrong while fetching vehicles.
        </div>
        <template v-else>
          <template
            class="table-responsive"
            v-if="refuels && refuels.length > 0"
          >
            <table class="table table-striped table-hover">
              <thead class="table-primary">
                <tr>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Fuel price</th>
                  <th>Fuel Amount</th>
                  <th>Total Cost</th>
                  <th>Mileage</th>
                  <th>Gas Station</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <RefuelTableRow
                  :refuel="refuel"
                  @edit="onEdit"
                  @delete="onDelete"
                  v-for="refuel in refuels"
                  :key="refuel.id"
                />
              </tbody>
            </table>
          </template>
          <NoEntitiesCard
            main-text="No refuels found"
            secondary-text="You haven't added any refuels yet."
            v-else
          />
        </template>
      </div>
    </div>
  </div>
</template>
