<script setup lang="ts">
import { FuelType } from "@chariot/shared";

const model = defineModel<FuelType | undefined>({ default: undefined });
</script>

<template>
  <label for="fuelTypeFilter" class="form-label small text-muted"
    >Fuel type</label
  >
  <select
    class="form-select form-select-sm"
    id="fuelTypeFilter"
    v-model="model"
  >
    <option :value="undefined" selected>All</option>
    <option :value="FuelType.GASOLINE">Gasoline</option>
    <option :value="FuelType.DIESEL">Diesel</option>
    <option :value="FuelType.ELECTRIC">Electric</option>
    <option :value="FuelType.HYBRID">Hybrid</option>
  </select>
</template>
