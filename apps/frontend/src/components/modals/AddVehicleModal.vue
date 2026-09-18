<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import type { CreateVehicleDto } from "@chariot/shared";
import VehicleForm from "../VehicleForm.vue";

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submit", vehicle: CreateVehicleDto): void;
}>();

const form = ref<CreateVehicleDto>({} as CreateVehicleDto);
const formRef = ref<InstanceType<typeof VehicleForm> | null>(null);

const handleSubmit = async () => {
  if (formRef.value) {
    const isValid = await formRef.value.validateForm();
    if (!isValid) return;
  }
  emits("submit", { ...(form.value as CreateVehicleDto) });
};

const handleClose = () => {
  emits("close");
};
</script>

<template>
  <div class="modal-header">
    <Icon
      icon="bi:check-circle"
      class="fs-4 me-3 text-primary"
    />
    <h5 class="modal-title mb-0">
      Add new vehicle
    </h5>
    <button
      type="button"
      class="btn-close"
      @click="handleClose"
    />
  </div>
  <div class="modal-body">
    <VehicleForm
      ref="formRef"
      v-model="form"
    />
  </div>
  <div class="modal-footer">
    <button
      type="button"
      class="btn btn-outline-secondary btn-sm"
      @click="handleClose"
    >
      Cancel
    </button>
    <button
      type="submit"
      class="btn btn-success btn-sm"
      @click="handleSubmit"
    >
      <Icon
        icon="bi:check-circle"
        class="me-1"
      />
      Add Entry
    </button>
  </div>
</template>
