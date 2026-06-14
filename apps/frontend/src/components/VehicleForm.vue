<script setup lang="ts">

import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import { ref } from "vue";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateVehicleDto } from "@chariot/shared";
import { UpdateVehicleDto } from "@chariot/shared";

const form = defineModel<Partial<Vehicle>>({ required: true });

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const errors = ref<Record<string, string>>({});

const validateForm = async (): Promise<boolean> => {
  errors.value = {};

  const submitData = { ...form.value };
  const dtoClass = props.isEdit ? UpdateVehicleDto : CreateVehicleDto;
  const dtoInstance = plainToInstance(dtoClass, submitData);

  const validationErrors = await validate(dtoInstance);

  if (validationErrors.length > 0) {
    validationErrors.forEach((err) => {
      if (err.property && err.constraints) {
        errors.value[err.property] = Object.values(err.constraints)[0];
      }
    });
    return false;
  }

  return true;
};

defineExpose({ validateForm });
</script>

<template>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="make" class="form-label">Make</label>
      <input
        id="make"
        type="text"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.make }"
        v-model="form.make"
        required
      />
      <div class="invalid-feedback" v-if="errors.make">{{ errors.make }}</div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="model" class="form-label">Model</label>
      <input
        id="model"
        type="text"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.model }"
        v-model="form.model"
        required
      />
      <div class="invalid-feedback" v-if="errors.model">{{ errors.model }}</div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="year" class="form-label">Year</label>
      <input
        id="year"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.year }"
        v-model.number="form.year"
        required
      />
      <div class="invalid-feedback" v-if="errors.year">{{ errors.year }}</div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="initialMileage" class="form-label">Initial mileage</label>
      <input
        id="initialMileage"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.initialMileage }"
        v-model.number="form.initialMileage"
        required
      />
      <div class="invalid-feedback" v-if="errors.initialMileage">{{ errors.initialMileage }}</div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="fuelType" class="form-label">Fuel type</label>
      <select
        id="fuelType"
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.fuelType }"
        v-model.number="form.fuelType"
        required
      >
        <option value="" hidden>Select fuel type</option>
        <option value="0">Gasoline</option>
        <option value="1">Diesel</option>
        <option value="2">Electric</option>
        <option value="3">Hybrid</option>
      </select>
      <div class="invalid-feedback" v-if="errors.fuelType">{{ errors.fuelType }}</div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="vehicleType" class="form-label">Vehicle type</label>
      <select
        id="vehicleType"
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.vehicleType }"
        v-model.number="form.vehicleType"
        required
      >
        <option value="" hidden>Select vehicle type</option>
        <option value="0">Car</option>
        <option value="1">Motorcycle</option>
      </select>
      <div class="invalid-feedback" v-if="errors.vehicleType">{{ errors.vehicleType }}</div>
    </div>
  </div>
  <div class="mb-3">
    <label for="vin" class="form-label">VIN</label>
    <input
      id="vin"
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.vin }"
      v-model="form.vin"
      required
    />
    <div class="invalid-feedback" v-if="errors.vin">{{ errors.vin }}</div>
  </div>
  <div class="mb-3">
    <label for="registrationNumber" class="form-label"
      >Registration number</label
    >
    <input
      id="registrationNumber"
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.registrationNumber }"
      v-model="form.registrationNumber"
      required
    />
    <div class="invalid-feedback" v-if="errors.registrationNumber">{{ errors.registrationNumber }}</div>
  </div>
</template>
