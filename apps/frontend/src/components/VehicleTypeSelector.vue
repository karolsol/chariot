<script setup lang="ts">
import { ref } from "vue";

const selected = ref("all");
defineExpose({ selected });
</script>

<template>
  <label for="vehicleFilter" class="form-label small text-muted">Type</label>
  <select
    class="form-select form-select-sm"
    v-model="selected"
    id="vehicleFilter"
  >
    <option value="all" selected>All</option>
    <option value="0">Car</option>
    <option value="1">Motorcycle</option>
  </select>
</template>
