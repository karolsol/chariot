<script setup lang="ts">
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import VehicleCard from "../components/VehicleCard.vue";
import { onMounted, ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import { vehicleService } from "../services/vehiclesService.ts";
import type { CreateVehicleDto } from "../../../../libs/shared/src/create-vehicle.dto.ts";
import AddVehicleModal from "../components/AddVehicleModal.vue";
import EditVehicleModal from "../components/EditVehicleModal.vue";
import type { UpdateVehicleDto } from "../../../../libs/shared/src/update-vehicle.dto.ts";

let vehicles = ref<Vehicle[]>([]);

let editedVehicle = ref<Vehicle>({} as Vehicle);

const addModal = ref<InstanceType<typeof AddVehicleModal> | null>(null);
const editModal = ref<InstanceType<typeof EditVehicleModal> | null>(null);

onMounted(async () => {
  vehicles.value = await vehicleService.getAll();
});

const onEdit = (vehicle: Vehicle) => {
  editedVehicle.value = vehicle;
  editModal.value?.show();
};

const onEditAccept = (id: string, vehicle: UpdateVehicleDto) => {
  vehicleService.update(id, vehicle).then((updatedVehicle) => {
    const index = vehicles.value.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehicles.value[index] = updatedVehicle;
    }
    editModal.value?.hide();
  });
};

const onCreate = () => {
  addModal.value?.show();
};

const onCreateAccept = (createVehicleDto: CreateVehicleDto) => {
  vehicleService.create(createVehicleDto).then((newVehicle) => {
    vehicles.value.push(newVehicle);
    addModal.value?.hide();
  });
};

const onDelete = (id: string) => {
  vehicleService.delete(id).then(() => {
    vehicles.value = vehicles.value.filter((v) => v.id !== id);
  });
};

const onStats = (id: string) => {
  console.log("Show stats for vehicle with id", id);
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h2>Your vehicles:</h2>
        <div class="row mb-4 align-items-end">
          <div class="col-md-3">
            <label for="vehicleFilter" class="form-label">Type</label>
            <select class="form-select form-select-sm" id="vehicleFilter">
              <option value="all" selected>All</option>
              <option value="0">Car</option>
              <option value="1">Motorcycle</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="fuelTypeFilter" class="form-label">Fuel type</label>
            <select class="form-select form-select-sm" id="fuelTypeFilter">
              <option value="all" selected>All</option>
              <option value="0">Gasoline</option>
              <option value="1">Diesel</option>
              <option value="2">Electric</option>
              <option value="3">Hybrid</option>
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
        <div class="row g-4 mt-4" id="vehiclesCards">
          <template v-if="vehicles?.length > 0">
            <div class="col-md-4" v-for="vehicle in vehicles" :key="vehicle.id">
              <VehicleCard
                :vehicle="vehicle"
                @edit="onEdit"
                @delete="onDelete"
                @stats="onStats"
              />
            </div>
          </template>
          <NoEntitiesCard
            main-text="No vehicles found"
            secondary-text="You haven't added any vehicles to your garage yet."
            v-else
          />
        </div>
      </div>
    </div>
  </div>
  <AddVehicleModal ref="addModal" @submit="onCreateAccept" />
  <EditVehicleModal
    ref="editModal"
    @submit="onEditAccept"
    :vehicle="editedVehicle"
  />
</template>
