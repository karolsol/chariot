<script setup lang="ts">

import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";

const form = defineModel<Partial<Vehicle>>({ required: true });
</script>

<template>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="fuelType" class="form-label">Fuel type</label>
      <select
        id="fuelType"
        class="form-select form-select-sm"
        v-model.number="form.fuelType"
        required
      >
        <option value="" hidden>Select fuel type</option>
        <option value="0">Gasoline</option>
        <option value="1">Diesel</option>
        <option value="2">Electric</option>
        <option value="3">Hybrid</option>
      </select>
    </div>
    <div class="col-md-6 mb-3">
      <label for="vehicleType" class="form-label">Vehicle type</label>
      <select
        id="vehicleType"
        class="form-select form-select-sm"
        v-model.number="form.vehicleType"
        required
      >
        <option value="" hidden>Select vehicle type</option>
        <option value="0">Car</option>
        <option value="1">Motorcycle</option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="make" class="form-label">Make</label>
      <input
        id="make"
        type="text"
        class="form-control form-control-sm"
        v-model="form.make"
        required
      />
    </div>
    <div class="col-md-6 mb-3">
      <label for="model" class="form-label">Model</label>
      <input
        id="model"
        type="text"
        class="form-control form-control-sm"
        v-model="form.model"
        required
      />
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="year" class="form-label">Year</label>
      <input
        id="year"
        type="number"
        class="form-control form-control-sm"
        v-model="form.year"
        required
      />
    </div>
    <div class="col-md-6 mb-3">
      <label for="initialMileage" class="form-label">Initial mileage</label>
      <input
        id="initialMileage"
        type="number"
        class="form-control form-control-sm"
        v-model="form.initialMileage"
        required
      />
    </div>
  </div>
  <div class="mb-3">
    <label for="vin" class="form-label">VIN</label>
    <input
      id="vin"
      type="text"
      class="form-control form-control-sm"
      v-model="form.vin"
      required
    />
  </div>
  <div class="mb-3">
    <label for="registrationNumber" class="form-label"
      >Registration number</label
    >
    <input
      id="registrationNumber"
      type="text"
      class="form-control form-control-sm"
      v-model="form.registrationNumber"
      required
    />
  </div>
</template>
