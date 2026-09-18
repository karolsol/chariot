<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, type PropType, ref } from "vue";
import MaintenanceForm from "../MaintenanceForm.vue";
import type { IMaintenance, IVehicle } from "@chariot/shared";

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submit", id: string, maintenance: Partial<IMaintenance>): void;
}>();

const props = defineProps({
  maintenance: {
    type: Object as PropType<IMaintenance>,
    required: true,
  },
  vehicles: {
    type: Array as PropType<IVehicle[]>,
    required: true,
  },
});

const form = ref<Partial<IMaintenance>>({} as Partial<IMaintenance>);
const vehicles = ref<IVehicle[]>([]);
const editedId = ref<string>("");
const formRef = ref<InstanceType<typeof MaintenanceForm> | null>(null);

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
  const { id, vehicle, userId, user, date, ...cleanMaintenance } =
    props.maintenance;
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
      Edit maintenance
    </h5>
    <button
      type="button"
      class="btn-close"
      @click="handleClose"
    />
  </div>
  <div class="modal-body">
    <MaintenanceForm
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
