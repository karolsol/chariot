<script setup lang="ts">
import type { Maintenance } from "../../../chariot/src/maintenance/maintenance.entity.ts";
import { computed, type PropType, ref } from "vue";
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateMaintenanceDto } from "@chariot/shared";
import { UpdateMaintenanceDto } from "@chariot/shared";

const form = defineModel<Partial<Maintenance>>({ required: true });
const props = defineProps({
  vehicles: {
    type: Array as PropType<Vehicle[]>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const errors = ref<Record<string, string>>({});

const validateForm = async (): Promise<boolean> => {
  errors.value = {};

  const submitData = { ...form.value };
  if (submitData.date instanceof Date) {
    submitData.date = submitData.date.toISOString();
  } else if (!submitData.date) {
    submitData.date = new Date().toISOString();
  }

  const dtoClass = props.isEdit ? UpdateMaintenanceDto : CreateMaintenanceDto;
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

const formattedDate = computed({
  get() {
    if (form.value.date) {
      return form.value.date.toISOString().split("T")[0];
    } else {
      form.value.date! = new Date();
      return new Date().toISOString().split("T")[0];
    }
  },
  set(newValue) {
    if (newValue) {
      form.value.date! = new Date(newValue);
    }
  },
});
</script>

<template>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="entryVehicle" class="form-label">Vehicle</label>
      <select
        class="form-select form-select-sm"
        :class="{ 'is-invalid': errors.vehicleId }"
        id="entryVehicle"
        required
        v-model="form.vehicleId"
      >
        <option value="" hidden selected>Select Vehicle</option>
        <option
          v-for="vehicle in props.vehicles"
          :key="vehicle.id"
          :value="vehicle.id"
        >
          {{ vehicle.make }} {{ vehicle.model }}
        </option>
      </select>
      <div class="invalid-feedback" v-if="errors.vehicleId">{{ errors.vehicleId }}</div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="date" class="form-label">Date</label>
      <input
        type="date"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.date }"
        v-model="formattedDate"
        id="date"
        required
      />
      <div class="invalid-feedback" v-if="errors.date">{{ errors.date }}</div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="cost" class="form-label">Cost</label>
      <input
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.cost }"
        v-model.number="form.cost"
        id="cost"
        required
      />
      <div class="invalid-feedback" v-if="errors.cost">{{ errors.cost }}</div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="mileage" class="form-label">Mileage</label>
      <input
        type="number"
        class="form-control form-control-sm"
        :class="{ 'is-invalid': errors.mileage }"
        v-model.number="form.mileage"
        id="mileage"
        required
      />
      <div class="invalid-feedback" v-if="errors.mileage">{{ errors.mileage }}</div>
    </div>
  </div>
  <div class="mb-3">
    <label for="title" class="form-label">Title</label>
    <input
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.title }"
      v-model="form.title"
      id="title"
      required
    />
    <div class="invalid-feedback" v-if="errors.title">{{ errors.title }}</div>
  </div>
  <div class="mb-3">
    <label for="invoiceLink" class="form-label">Invoice link</label>
    <input
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.invoiceLink }"
      v-model="form.invoiceLink"
      id="invoiceLink"
    />
    <div class="invalid-feedback" v-if="errors.invoiceLink">{{ errors.invoiceLink }}</div>
  </div>
  <div class="mb-3">
    <label for="description" class="form-label">Description</label>
    <textarea
      type="text"
      class="form-control form-control-sm"
      :class="{ 'is-invalid': errors.description }"
      v-model="form.description"
      id="description"
    ></textarea>
    <div class="invalid-feedback" v-if="errors.description">{{ errors.description }}</div>
  </div>
</template>
