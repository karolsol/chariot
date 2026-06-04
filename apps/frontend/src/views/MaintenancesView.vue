<script setup lang="ts">
import MaintenanceTableRow from "../components/MaintenanceTableRow.vue";
import { onMounted, ref } from "vue";
import type { Maintenance } from "../../../chariot/src/maintenance/maintenance.entity.ts";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import { maintenanceService } from "../services/maintenanceService.ts";
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import { vehicleService } from "../services/vehiclesService.ts";
import ConfirmationPopup from "../components/modals/ConfirmationPopup.vue";
import { useModalStore } from "../stores/modalStore.ts";
import EditMaintenanceModal from "../components/modals/EditMaintenanceModal.vue";
import type { UpdateMaintenanceDto } from "../../../../libs/shared/src/update-maintenance.dto.ts";
import AddMaintenanceModal from "../components/modals/AddMaintenanceModal.vue";
import { omitEmptyFields } from "../utils/omitEmptyFields.ts";

const maintenances = ref<Maintenance[]>([]);
const vehicles = ref<Vehicle[]>([]);

const selectedMaintenance = ref<Maintenance>({} as Maintenance);

const modalStore = useModalStore();

onMounted(async () => {
  maintenances.value = await maintenanceService.getAll();
  vehicles.value = await vehicleService.getAll();
});

const onEdit = (id: string) => {
  selectedMaintenance.value = maintenances.value.find((v) => v.id === id)!;
  modalStore.open(EditMaintenanceModal, {
    props: {
      maintenance: selectedMaintenance.value,
      vehicles: vehicles.value,
    },
    functions: {
      submit: onEditAccept,
    },
  });
};

const onEditAccept = (id: string, maintenance: UpdateMaintenanceDto) => {
  maintenanceService.update(id, maintenance).then((updatedMaintenance) => {
    const index = maintenances.value.findIndex((v) => v.id === id);
    if (index !== -1) {
      maintenances.value[index] = {
        ...maintenances.value[index],
        ...updatedMaintenance,
      };
    }
    modalStore.close();
  });
};

const onDelete = (id: String) => {
  selectedMaintenance.value = maintenances.value.find(
    (v) => v.id === id,
  ) as Maintenance;
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
      submit: onDeleteAccept,
    },
  });
};

const onDeleteAccept = () => {
  maintenanceService.delete(selectedMaintenance.value.id).then(() => {
    maintenances.value = maintenances.value.filter(
      (v) => v.id !== selectedMaintenance.value.id,
    );
  });
  modalStore.close();
};

const onCreate = (): void => {
  modalStore.open(AddMaintenanceModal, {
    props: {
      vehicles: vehicles.value,
    },
    functions: {
      submit: onCreateAccept,
    },
  });
};

const onCreateAccept = async (maintenance: Partial<Maintenance>): Promise<void> => {
  const newMaintenance = await maintenanceService.create(
    omitEmptyFields(maintenance as any) as any,
  );
  newMaintenance.Vehicle = (await vehicleService.getById(
    newMaintenance.vehicleId,
  )) as Vehicle;
  maintenances.value.push(newMaintenance);
  modalStore.close();
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your maintenance:</h2>
        <div class="row mb-4 align-items-end">
          <div class="col-md-3">
            <label for="vehicleFilter" class="form-label">Vehicle</label>
            <select class="form-select" id="vehicleFilter">
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
            <select class="form-select" id="dateRange">
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
              Add new entry
            </button>
          </div>
        </div>
        <h4>Maintenance Overview</h4>
        <div class="table-responsive" v-if="maintenances.length > 0">
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
        </div>
        <NoEntitiesCard
          main-text="No maintenances found"
          secondary-text="You haven't added any maintenances yet."
          v-else
        />
      </div>
    </div>
  </div>
</template>
