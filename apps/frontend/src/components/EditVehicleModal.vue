<script setup lang="ts">
import { onMounted, type PropType, ref, watch } from "vue";
import { Modal } from "bootstrap";
import { Vehicle } from "../../../chariot/src/vehicle/vehicle.entity.ts";
import type { UpdateVehicleDto } from "../../../../libs/shared/src/update-vehicle.dto.ts";
import VehicleForm from "./VehicleForm.vue";

const emit = defineEmits<{
  submit: [id: string, vehicle: UpdateVehicleDto];
}>();

const props = defineProps({
  vehicle: {
    type: Object as PropType<Vehicle>,
    required: true,
  },
});

let modalInstance: Modal | null = null;

const form = ref<UpdateVehicleDto>({} as UpdateVehicleDto);
const editedId = ref<string>("");

const modalRef = ref<HTMLDivElement | null>(null);

const hide = () => {
  Modal.getInstance(modalRef.value!)?.hide();
};

const show = () => {
  modalInstance?.show();
};

const handleSubmit = () => {
  emit("submit", editedId.value, form.value);
};

defineExpose({ hide, show });

onMounted(() => {
  if (modalRef.value) {
    modalInstance = Modal.getOrCreateInstance(modalRef.value);
  }
});

watch(
  () => props.vehicle,
  (editedVehicle) => {
    if (editedVehicle) {
      editedId.value = editedVehicle.id;
      const { id, created_at, updated_at, userId, ...cleanVehicle } =
        editedVehicle;
      form.value = { ...(cleanVehicle as UpdateVehicleDto) };
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-pencil-square text-success me-2"></i>Edit Entry
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <VehicleForm v-model="form" />
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
            <i class="bi bi-check-circle me-1"></i>Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
