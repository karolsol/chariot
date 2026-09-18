<script setup lang="ts">
import { ref } from "vue";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateVehicleDto, type IVehicle } from "@chariot/shared";
import { UpdateVehicleDto } from "@chariot/shared";

const form = defineModel<Partial<IVehicle>>({ required: true });

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
      <label
        for="make"
        class="form-label"
      >Make</label>
      <input
        id="make"
        v-model="form.make"
        v-autofocus
        type="text"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.make }"
        required
      >
      <div
        v-if="errors.make"
        class="invalid-feedback"
      >
        {{ errors.make }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label
        for="model"
        class="form-label"
      >Model</label>
      <input
        id="model"
        v-model="form.model"
        type="text"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.model }"
        required
      >
      <div
        v-if="errors.model"
        class="invalid-feedback"
      >
        {{ errors.model }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label
        for="year"
        class="form-label"
      >Year</label>
      <input
        id="year"
        v-model.number="form.year"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.year }"
        required
      >
      <div
        v-if="errors.year"
        class="invalid-feedback"
      >
        {{ errors.year }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label
        for="initialMileage"
        class="form-label"
      >Initial mileage</label>
      <input
        id="initialMileage"
        v-model.number="form.initialMileage"
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.initialMileage }"
        required
      >
      <div
        v-if="errors.initialMileage"
        class="invalid-feedback"
      >
        {{ errors.initialMileage }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label
        for="fuelType"
        class="form-label"
      >Fuel type</label>
      <select
        id="fuelType"
        v-model.number="form.fuelType"
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.fuelType }"
        required
      >
        <option
          value=""
          hidden
        >
          Select fuel type
        </option>
        <option value="0">
          Gasoline
        </option>
        <option value="1">
          Diesel
        </option>
        <option value="2">
          Electric
        </option>
        <option value="3">
          Hybrid
        </option>
      </select>
      <div
        v-if="errors.fuelType"
        class="invalid-feedback"
      >
        {{ errors.fuelType }}
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label
        for="vehicleType"
        class="form-label"
      >Vehicle type</label>
      <select
        id="vehicleType"
        v-model.number="form.vehicleType"
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.vehicleType }"
        required
      >
        <option
          value=""
          hidden
        >
          Select vehicle type
        </option>
        <option value="0">
          Car
        </option>
        <option value="1">
          Motorcycle
        </option>
      </select>
      <div
        v-if="errors.vehicleType"
        class="invalid-feedback"
      >
        {{ errors.vehicleType }}
      </div>
    </div>
  </div>
  <div class="mb-3">
    <label
      for="vin"
      class="form-label"
    >VIN</label>
    <input
      id="vin"
      v-model="form.vin"
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.vin }"
      required
    >
    <div
      v-if="errors.vin"
      class="invalid-feedback"
    >
      {{ errors.vin }}
    </div>
  </div>
  <div class="mb-3">
    <label
      for="registrationNumber"
      class="form-label"
    >Registration number</label>
    <input
      id="registrationNumber"
      v-model="form.registrationNumber"
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.registrationNumber }"
      required
    >
    <div
      v-if="errors.registrationNumber"
      class="invalid-feedback"
    >
      {{ errors.registrationNumber }}
    </div>
  </div>
</template>
