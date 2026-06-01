<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, type PropType, ref } from "vue";
import { Vehicle } from "../../../../chariot/src/vehicle/vehicle.entity.ts";
import type { UpdateVehicleDto } from "../../../../../libs/shared/src/update-vehicle.dto.ts";
import VehicleForm from "../VehicleForm.vue";

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submit", id: string, vehicle: UpdateVehicleDto): void;
}>();

const props = defineProps({
  vehicle: {
    type: Object as PropType<Vehicle>,
    required: true,
  },
});

const form = ref<UpdateVehicleDto>({} as UpdateVehicleDto);
const editedId = ref<string>("");

const handleSubmit = () => {
  emits("submit", editedId.value, form.value);
};

const handleClose = () => {
  emits("close");
};

onMounted(() => {
  const { id, created_at, updated_at, userId, user, ...cleanVehicle } =
    props.vehicle;
  form.value = { ...(cleanVehicle as UpdateVehicleDto) };
  editedId.value = id;
});
</script>

<template>
  <div class="modal-header">
    <Icon icon="bi:pencil-square" class="fs-4 me-3 text-primary" />
    <h5 class="modal-title mb-0">Edit vehicle</h5>
    <button type="button" class="btn-close" @click="handleClose" />
  </div>
  <div class="modal-body">
    <VehicleForm v-model="form" />
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
