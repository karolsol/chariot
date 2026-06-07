<script setup lang="ts">
import { onMounted, type PropType, ref } from "vue";
import { Vehicle } from "../../../../chariot/src/vehicle/vehicle.entity.ts";
import type { Refuel } from "../../../../chariot/src/refuel/refuel.entity.ts";
import { Icon } from "@iconify/vue";
import RefuelForm from "../RefuelForm.vue";

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submit", refuel: Partial<Refuel>): void;
}>();

const props = defineProps({
  vehicles: {
    type: Array as PropType<Vehicle[]>,
    required: true,
  },
});

const form = ref<Partial<Refuel>>({} as Partial<Refuel>);
const vehicles = ref<Vehicle[]>([]);
const formRef = ref<InstanceType<typeof RefuelForm> | null>(null);

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
    <h5 class="modal-title mb-0">Add refuel</h5>
    <button type="button" class="btn-close" @click="handleClose" />
  </div>
  <div class="modal-body">
    <RefuelForm ref="formRef" v-model="form" :vehicles="vehicles" />
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
