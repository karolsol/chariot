<script setup lang="ts">
import { VehicleType } from "@chariot/shared";

const model = defineModel<VehicleType | undefined>({ default: undefined });
</script>

<template>
  <label for="vehicleFilter" class="form-label small text-muted">Type</label>
  <select class="form-select form-select-sm" v-model="model" id="vehicleFilter">
    <option :value="undefined" selected>All</option>
    <option :value="VehicleType.CAR">Car</option>
    <option :value="VehicleType.MOTORCYCLE">Motorcycle</option>
  </select>
</template>
