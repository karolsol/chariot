<script setup lang="ts">
import { onMounted, ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import { vehicleService } from "../services/vehiclesService.ts";
import ConfirmationPopup from "../components/modals/ConfirmationPopup.vue";
import { useModalStore } from "../stores/modalStore.ts";
import { omitEmptyFields } from "../utils/omitEmptyFields.ts";
import type { Refuel } from "../../../chariot/src/refuel/refuel.entity.ts";
import { refuelService } from "../services/refuelService.ts";
import RefuelTableRow from "../components/RefuelTableRow.vue";
import AddRefuelModal from "../components/modals/AddRefuelModal.vue";
import EditRefuelModal from "../components/modals/EditRefuelModal.vue";
import type { UpdateRefuelDto } from "../../../../libs/shared/src/update-refuel.dto.ts";

const refuels = ref<Refuel[]>([]);
const vehicles = ref<Vehicle[]>([]);

const selectedRefuel = ref<Refuel>({} as Refuel);

const modalStore = useModalStore();

onMounted(async () => {
  refuels.value = await refuelService.getAll();
  vehicles.value = await vehicleService.getAll();
});

const onEdit = (id: string) => {
  selectedRefuel.value = refuels.value.find((v) => v.id === id)!;
  modalStore.open(EditRefuelModal, {
    props: {
      refuel: selectedRefuel.value,
      vehicles: vehicles.value,
    },
    functions: {
      submit: onEditAccept,
    },
  });
};

const onEditAccept = (id: string, refuel: UpdateRefuelDto) => {
  refuelService.update(id, refuel).then((updatedRefuel) => {
    const index = refuels.value.findIndex((v) => v.id === id);
    if (index !== -1) {
      refuels.value[index] = {
        ...refuels.value[index],
        ...updatedRefuel,
      };
    }
    modalStore.close();
  });
};

const onDelete = (id: String) => {
  selectedRefuel.value = refuels.value.find((v) => v.id === id) as Refuel;
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
      submit: onDeleteAccept,
    },
  });
};

const onDeleteAccept = () => {
  refuelService.delete(selectedRefuel.value.id).then(() => {
    refuels.value = refuels.value.filter(
      (v) => v.id !== selectedRefuel.value.id,
    );
  });
  modalStore.close();
};

const onCreate = (): void => {
  modalStore.open(AddRefuelModal, {
    props: {
      vehicles: vehicles.value,
    },
    functions: {
      submit: onCreateAccept,
    },
  });
};

const onCreateAccept = async (refuel: Partial<Refuel>): Promise<void> => {
  const newRefuel = await refuelService.create(omitEmptyFields(refuel) as any);
  newRefuel.vehicle = (await vehicleService.getById(
    newRefuel.vehicleId,
  )) as Vehicle;
  refuels.value.push(newRefuel);
  modalStore.close();
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your refuels:</h2>
        <div class="row mb-4 align-items-end">
          <div class="col-md-3">
            <label for="vehicleFilter" class="form-label">Vehicle</label>
            <select class="form-select form-select-sm" id="vehicleFilter">
              <option value="all" selected>All</option>
              <option
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                :value="vehicle.id"
              >
                {{ vehicle.make }} {{ vehicle.model }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="dateRange" class="form-label">Date Range</label>
            <select class="form-select form-select-sm" id="dateRange">
              <option value="all" selected>All</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <button
              class="btn btn-primary btn-sm"
              type="button"
              @click="onCreate"
            >
              <i class="bi bi-funnel me-1"></i>Add new entry
            </button>
          </div>
        </div>
        <h4>Refueling Overview</h4>
        <div class="table-responsive" v-if="refuels.length > 0">
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
        </div>
        <NoEntitiesCard
          main-text="No refuels found"
          secondary-text="You haven't added any refuels yet."
          v-else
        />
      </div>
    </div>
  </div>
</template>
