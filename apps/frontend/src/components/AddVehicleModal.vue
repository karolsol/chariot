<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { CreateVehicleDto } from "../../../../libs/shared/src/create-vehicle.dto.ts";
import { Modal } from "bootstrap";

const emit = defineEmits<{
  submit: [vehicle: CreateVehicleDto];
}>();

let modalInstance: Modal | null = null;

const form = ref<CreateVehicleDto>({} as CreateVehicleDto);

const modalRef = ref<HTMLDivElement | null>(null);

const hide = () => {
  console.log("HIDE")
  Modal.getInstance(modalRef.value!)?.hide();
};

const show = () => {
  modalInstance?.show();
};
const handleSubmit = () => {
  emit("submit", { ...(form.value as CreateVehicleDto) });
};
defineExpose({ hide, show });

onMounted(() => {
  if (modalRef.value) {
    modalInstance = Modal.getOrCreateInstance(modalRef.value);
  }
});
</script>

<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addEntryLabel">
            <i class="bi bi-plus-circle text-success me-2"></i>Add New Entry
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="FuelType" class="form-label">Fuel type</label>
              <select
                class="form-select form-select-sm"
                v-model.number="form.fuelType"
                required
              >
                <option value="" hidden>Select fuel type</option>
                <option value="0">Gasoline</option>
                <option value="1">Diesel</option>
                <option value="2">Electric</option>
                <option value="3">Hybrid</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="editVehicleType" class="form-label"
                >Vehicle type</label
              >
              <select
                class="form-select form-select-sm"
                v-model.number="form.vehicleType"
                required
              >
                <option value="" hidden>Select vehicle type</option>
                <option value="0">Car</option>
                <option value="1">Motorcycle</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="Make" class="form-label">Make</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="form.make"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="Model" class="form-label">Model</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="form.model"
                required
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="Year" class="form-label">Year</label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="form.year"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="Mileage" class="form-label">Initial mileage</label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="form.initialMileage"
                required
              />
            </div>
          </div>
          <div class="mb-3">
            <label for="Vin" class="form-label">VIN</label>
            <input
              type="text"
              class="form-control form-control-sm"
              v-model="form.vin"
              required
            />
          </div>
          <div class="mb-3">
            <label for="RegistrationNumber" class="form-label"
              >Registration number</label
            >
            <input
              type="text"
              class="form-control form-control-sm"
              v-model="form.registrationNumber"
              required
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-success btn-sm"
            @click="handleSubmit"
          >
            <i class="bi bi-check-circle me-1"></i>Add Entry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
