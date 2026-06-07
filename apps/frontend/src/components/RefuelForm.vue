<script setup lang="ts">
import type { Refuel } from "../../../chariot/src/refuel/refuel.entity.ts";
import { computed, type PropType } from "vue";
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";

const form = defineModel<Partial<Refuel>>({ required: true });
const props = defineProps({
  vehicles: {
    type: Array as PropType<Vehicle[]>,
    required: true,
  },
});

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
      <label for="editEntryVehicle" class="form-label">Vehicle</label>
      <select class="form-select form-select-sm" v-model="form.vehicleId">
        <option value="" hidden>Select Vehicle</option>
        <option
          v-for="vehicle in props.vehicles"
          :key="vehicle.id"
          :value="vehicle.id"
        >
          {{ vehicle.make }} {{ vehicle.model }}
        </option>
      </select>
    </div>
    <div class="col-md-6 mb-3">
      <label for="editDate" class="form-label">Date</label>
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="formattedDate"
        required
      />
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="editFuelAmount" class="form-label">Fuel amount</label>
      <input
        type="number"
        class="form-control form-control-sm"
        v-model="form.fuelAmount"
        required
      />
    </div>
    <div class="col-md-6 mb-3">
      <label for="editFuelPrice" class="form-label">Fuel price</label>
      <input
        type="number"
        class="form-control form-control-sm"
        v-model="form.fuelPrice"
        required
      />
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="editFuelType" class="form-label">Fuel type</label>
      <select
        class="form-select form-select-sm"
        v-model.number="form.fuelType"
        required
      >
        <option value="" hidden>Select fuel type</option>
        <option value="0">Gasoline</option>
        <option value="1">Diesel</option>
        <option value="2">Electricity</option>
      </select>
    </div>
    <div class="col-md-6 mb-3">
      <label for="editMileageAtRefuel" class="form-label">Mileage</label>
      <input
        type="number"
        class="form-control form-control-sm"
        v-model="form.mileageAtRefuel"
        required
      />
    </div>
  </div>
  <div class="mb-3">
    <label for="editGasStation" class="form-label">Gas station</label>
    <input
      type="text"
      class="form-control form-control-sm"
      v-model="form.gasStation"
      required
    />
  </div>
  <div class="mb-3">
    <label for="editInvoiceLink" class="form-label">Invoice link</label>
    <input
      type="text"
      class="form-control form-control-sm"
      v-model="form.invoiceLink"
      required
    />
  </div>
</template>
