<script setup lang="ts">
import { ref } from "vue";

const selected = ref("all");
defineExpose({ selected });
</script>

<template>
  <label for="fuelTypeFilter" class="form-label">Fuel type</label>
  <select
    class="form-select form-select-sm"
    id="fuelTypeFilter"
    v-model="selected"
  >
    <option value="all" selected>All</option>
    <option value="0">Gasoline</option>
    <option value="1">Diesel</option>
    <option value="2">Electric</option>
    <option value="3">Hybrid</option>
  </select>
</template>
