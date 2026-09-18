<script setup lang="ts">
import { Icon } from "@iconify/vue";
import RefuelForm from "../RefuelForm.vue";
import { onMounted, type PropType, ref } from "vue";
import type { IRefuel, IVehicle } from "@chariot/shared";

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submit", id: string, refuel: Partial<IRefuel>): void;
}>();

const props = defineProps({
  refuel: {
    type: Object as PropType<IRefuel>,
    required: true,
  },
  vehicles: {
    type: Array as PropType<IVehicle[]>,
    required: true,
  },
});

const form = ref<Partial<IRefuel>>({} as Partial<IRefuel>);
const vehicles = ref<IVehicle[]>([]);
const editedId = ref<string>("");
const formRef = ref<InstanceType<typeof RefuelForm> | null>(null);

const handleSubmit = async () => {
  if (formRef.value) {
    const isValid = await formRef.value.validateForm();
    if (!isValid) return;
  }
  const { vehicleId, ...rest } = form.value;
  emits("submit", editedId.value, rest);
};

const handleClose = () => {
  emits("close");
};

onMounted(() => {
  const { id, vehicle, date, ...cleanMaintenance } = props.refuel;
  form.value = { ...cleanMaintenance, date: new Date(date) };
  editedId.value = id;
  vehicles.value = props.vehicles;
});
</script>

<template>
  <div class="modal-header">
    <Icon
      icon="bi:pencil-square"
      class="fs-4 me-3 text-primary"
    />
    <h5 class="modal-title mb-0">
      Edit refuel
    </h5>
    <button
      type="button"
      class="btn-close"
      @click="handleClose"
    />
  </div>
  <div class="modal-body">
    <RefuelForm
      ref="formRef"
      v-model="form"
      :vehicles="vehicles"
      :is-edit="true"
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
      Apply
    </button>
  </div>
</template>
