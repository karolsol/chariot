<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, type PropType, ref, watch } from "vue";
import { Modal } from "bootstrap";
import type { VehicleStatsDto } from "../../../../libs/shared/src/vehicle-stats.dto.ts";

const props = defineProps({
  stats: {
    type: Object as PropType<VehicleStatsDto>,
    required: true,
  },
});

let modalInstance: Modal | null = null;

const displayedStats = ref<VehicleStatsDto>({} as VehicleStatsDto);

const modalRef = ref<HTMLDivElement | null>(null);

const hide = () => {
  Modal.getInstance(modalRef.value!)?.hide();
};

const show = () => {
  modalInstance?.show();
};

defineExpose({ hide, show });

onMounted(() => {
  if (modalRef.value) {
    modalInstance = Modal.getOrCreateInstance(modalRef.value);
  }
});

watch(
  () => props.stats,
  (stats) => {
    if (stats) {
      displayedStats.value = stats;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="vehicleModalLabel">
            <i class="bi bi-car-front me-2"></i> Vehicle Stats
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
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
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
