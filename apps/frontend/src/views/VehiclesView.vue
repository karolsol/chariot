<script setup lang="ts">
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import VehicleCard from "../components/VehicleCard.vue";
import { onMounted, ref } from "vue";
import NoEntitiesCard from "../components/NoEntitiesCard.vue";
import api from "../services/api.ts";

let vehicles = ref<Vehicle[]>([]);

const fetchVehicles = async () => {
  const { data } = await api.get("/vehicles");
  vehicles.value = data;
};

onMounted(() => {
  fetchVehicles();
});
const onEdit = (vehicle: Vehicle) => {
  console.log("Edit vehicle", vehicle);
};

const onDelete = (id: string) => {
  console.log("Delete vehicle with id", id);
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
              data-bs-toggle="modal"
              data-bs-target="#addEntryModal"
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
</template>
