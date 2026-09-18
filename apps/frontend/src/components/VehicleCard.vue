<script setup lang="ts">

import type { IVehicle } from "@chariot/shared";

defineProps<{
  vehicle: IVehicle;
}>();

defineEmits<{
  (e: "stats", id: string): void;
  (e: "edit", vehicle: IVehicle): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="card shadow h-100">
    <div class="card-body">
      <h5 class="card-title">
        {{ vehicle.make }} {{ vehicle.model }}
      </h5>

      <div class="mb-2">
        <p class="card-text mb-0">
          VIN: {{ vehicle.vin }}
        </p>
        <p class="card-text mb-0">
          Registration: {{ vehicle.registrationNumber }}
        </p>
        <p class="card-text mb-0">
          Year: {{ vehicle.year }}
        </p>
      </div>

      <button
        class="btn btn-sm btn-outline-info me-1"
        @click="$emit('stats', vehicle.id)"
      >
        Stats
      </button>

      <button
        class="btn btn-sm btn-outline-primary me-1"
        @click="$emit('edit', vehicle)"
      >
        Edit
      </button>

      <button
        class="btn btn-sm btn-outline-danger"
        @click="$emit('delete', vehicle.id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped></style>
