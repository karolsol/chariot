<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";
import { Modal } from "bootstrap";

type Variant =
  | "danger"
  | "warning"
  | "success"
  | "info"
  | "primary"
  | "secondary";

const props = defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  icon: string;
  variant: Variant;
  closeOnBackdrop?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const modalEl = ref<HTMLElement | null>(null);

function getModal(): Modal {
  return Modal.getOrCreateInstance(modalEl.value!);
}

watch(
  () => props.modelValue,
  (open) => {
    open ? getModal().show() : getModal().hide();
  },
);

function onHidden(): void {
  emit("update:modelValue", false);
  emit("cancel");
}

onMounted(() => {
  modalEl.value?.addEventListener("hidden.bs.modal", onHidden);
});

onBeforeUnmount(() => {
  getModal().dispose();
});

function confirm(): void {
  emit("confirm");
  getModal().hide();
}
</script>

<template>
  <teleport to="body">
    <div ref="modalEl" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div class="d-flex align-items-center gap-2">
              <Icon
                v-if="icon"
                :icon="icon"
                class="fs-4"
                :class="`text-${variant}`"
              />
              <h5 class="modal-title fw-semibold mb-0">{{ title }}</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" />
          </div>

          <div class="modal-body pt-2">
            <p class="mb-0 text-secondary">{{ message }}</p>
          </div>

          <div class="modal-footer border-0 pt-0 justify-content-end">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn"
              :class="`btn-${variant}`"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
