<script setup lang="ts">
import type {Vehicle} from "../../../chariot/src/vehicle/vehicle.entity.ts";
import VehicleCard from "../components/VehicleCard.vue";

const vehicle: any = {
  id: "2df1e8b-9c3a-4c5e-8b1a-2f1e8b9c3a4c",
  initialMileage: 2000,
  userId: "1a2b3c4d-5e6f-7g8h-9i0j-1a2b3c4d5e6f",
  created_at: new Date("2023-01-01T00:00:00Z"),
  updated_at: new Date("2023-01-01T00:00:00Z"),
  make: "Toyota",
  model: "Corolla",
  year: 2020,
  vin: "1HGBH41JXMN109186",
  registrationNumber: "ABC123",
  fuelType: 0,
  vehicleType: 0,
};

const onEdit = (vehicle: Vehicle) => {
  console.log("Edit vehicle", vehicle);
};

const onDelete = (id: number | string) => {
  console.log("Delete vehicle with id", id);
};

const onStats = (id: number | string) => {
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
          <div class="col-md-4">
            <div class="card shadow h-100">
              <VehicleCard
                :vehicle="vehicle"
                @edit="onEdit"
                @delete="onDelete"
                @stats="onStats"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
