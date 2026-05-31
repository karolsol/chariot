<script setup lang="ts">
import { type PropType } from "vue";
import type { VehicleStatsDto } from "../../../../libs/shared/src/vehicle-stats.dto.ts";
import { Icon } from "@iconify/vue";

defineProps({
  stats: {
    type: Object as PropType<VehicleStatsDto>,
    required: true,
  },
});

const emits = defineEmits<{
  (e: "close"): void;
}>();

const handleClose = () => {
  emits("close");
};
</script>

<template>
  <div class="modal-header">
    <Icon icon="oui:stats" class="fs-4 me-3 text-primary" />
    <h5 class="modal-title mb-0">Stats for selected vehicle</h5>
    <button type="button" class="btn-close" @click="handleClose" />
  </div>
  <div class="modal-body">
    <div class="row g-3">
      <div class="col-md-6">
        <div class="card border-primary h-100">
          <div class="card-body text-center">
            <h6>Average Consumption</h6>
            <h3 class="text-primary mb-1">
              <span id="averageConsumption" class="me-1"></span>L/100km
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-success h-100">
          <div class="card-body text-center">
            <h6>Min Consumption</h6>
            <h3 class="text-success mb-1">
              <span id="maxConsumption" class="me-1"></span>L/100km
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-danger-subtle h-100">
          <div class="card-body text-center">
            <h6>Max Consumption</h6>
            <h3 class="text-danger mb-1">
              <span id="minConsumption" class="me-1"></span>L/100km
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-info h-100">
          <div class="card-body text-center">
            <h6>Total Fuel Used</h6>
            <h3 class="text-info mb-1">
              <span id="totalFuelUsed" class="me-1"></span>L
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-secondary h-100">
          <div class="card-body text-center">
            <h6>Traveled Distance</h6>
            <h3 class="text-secondary mb-1">
              <span id="traveledDistance" class="me-1"></span>km
            </h3>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-warning h-100">
          <div class="card-body text-center">
            <h6>Cost per km</h6>
            <h3 class="text-warning mb-1">
              <span id="costPerKm" class="me-1"></span>zł/km
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button
      type="button"
      class="btn btn-outline-secondary"
      @click="handleClose"
    >
      Close
    </button>
  </div>
</template>
