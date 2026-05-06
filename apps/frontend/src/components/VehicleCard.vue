<script setup lang="ts">
import type { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";

defineProps<{
  vehicle: Vehicle;
}>();

defineEmits<{
  (e: "stats", id: string): void;
  (e: "edit", vehicle: Vehicle): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="card shadow h-100">
    <div class="card-body">
      <h5 class="card-title">{{ vehicle.make }} {{ vehicle.model }}</h5>

      <div class="mb-2">
        <p class="card-text mb-0">VIN: {{ vehicle.vin }}</p>
        <p class="card-text mb-0">
          Registration: {{ vehicle.registrationNumber }}
        </p>
        <p class="card-text mb-0">Year: {{ vehicle.year }}</p>
      </div>

      <button
        @click="$emit('stats', vehicle.id)"
        class="btn btn-sm btn-outline-info me-1"
      >
        Stats
      </button>

      <button
        @click="$emit('edit', vehicle)"
        class="btn btn-sm btn-outline-primary me-1"
      >
        Edit
      </button>

      <button
        @click="$emit('delete', vehicle.id)"
        class="btn btn-sm btn-outline-danger"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped></style>
