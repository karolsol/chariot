<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import type { CreateVehicleDto } from "../../../../libs/shared/src/create-vehicle.dto.ts";
import { Modal } from "bootstrap";
import VehicleForm from "./VehicleForm.vue";

const emit = defineEmits<{
  submit: [vehicle: CreateVehicleDto];
}>();

let modalInstance: Modal | null = null;

const form = ref<CreateVehicleDto>({} as CreateVehicleDto);

const modalRef = ref<HTMLDivElement | null>(null);

const hide = () => {
  console.log("HIDE");
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
            <Icon icon="bi:plus-circle" class="me-2" />
            Add New Entry
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
            <Icon icon="bi:check-circle" class="me-1" />
            Add Entry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
