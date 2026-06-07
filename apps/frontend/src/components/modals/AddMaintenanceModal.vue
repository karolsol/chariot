<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, type PropType, ref } from "vue";
import { Vehicle } from "../../../../chariot/src/vehicle/vehicle.entity.ts";
import MaintenanceForm from "../MaintenanceForm.vue";
import type { Maintenance } from "../../../../chariot/src/maintenance/maintenance.entity.ts";

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submit", maintenance: Partial<Maintenance>): void;
}>();

const props = defineProps({
  vehicles: {
    type: Array as PropType<Vehicle[]>,
    required: true,
  },
});

const form = ref<Partial<Maintenance>>({} as Partial<Maintenance>);
const vehicles = ref<Vehicle[]>([]);
const formRef = ref<InstanceType<typeof MaintenanceForm> | null>(null);

const handleSubmit = async () => {
  if (formRef.value) {
    const isValid = await formRef.value.validateForm();
    if (!isValid) return;
  }
  emits("submit", form.value);
};

const handleClose = () => {
  emits("close");
};

onMounted(() => {
  vehicles.value = props.vehicles;
});
</script>

<template>
  <div class="modal-header">
    <Icon icon="bi:pencil-square" class="fs-4 me-3 text-primary" />
    <h5 class="modal-title mb-0">Add maintenance</h5>
    <button type="button" class="btn-close" @click="handleClose" />
  </div>
  <div class="modal-body">
    <MaintenanceForm ref="formRef" v-model="form" :vehicles="vehicles" />
  </div>
  <div class="modal-footer">
    <button
      type="button"
      class="btn btn-outline-secondary btn-sm"
      @click="handleClose"
    >
      Cancel
    </button>
    <button type="submit" class="btn btn-success btn-sm" @click="handleSubmit">
      <Icon icon="bi:check-circle" class="me-1" />
      Apply
    </button>
  </div>
</template>
