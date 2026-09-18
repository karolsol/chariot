<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { vAutofocus } from "../../directives/vAutofocus";

type Variant =
  "danger" | "warning" | "success" | "info" | "primary" | "secondary";

const props = defineProps<{
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  icon: string;
  variant: Variant;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "close"): void;
}>();

function handleSubmit(): void {
  emit("submit");
}

function handleClose(): void {
  emit("close");
}
</script>

<template>
  <div class="modal-header border-0 pb-0">
    <div class="d-flex align-items-center gap-2">
      <Icon
        v-if="props.icon"
        :icon="props.icon"
        class="fs-4"
        :class="`text-${props.variant}`"
      />
      <h5 class="modal-title fw-semibold mb-0">
        {{ props.title }}
      </h5>
    </div>
    <button
      type="button"
      class="btn-close"
      @click="handleClose"
    />
  </div>

  <div class="modal-body pt-2">
    <p class="mb-0 text-body-secondary">
      {{ props.message }}
    </p>
  </div>

  <div class="modal-footer border-0 pt-0 justify-content-end">
    <button
      v-autofocus
      type="button"
      class="btn btn-outline-secondary"
      @click="handleClose"
    >
      {{ props.cancelText }}
    </button>
    <button
      type="button"
      class="btn"
      :class="`btn-${props.variant}`"
      @click="handleSubmit"
    >
      {{ props.confirmText }}
    </button>
  </div>
</template>
