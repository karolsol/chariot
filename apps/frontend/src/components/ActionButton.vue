<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps({
  icon: { type: String, required: true },
  variant: { type: String, default: "primary" },
  title: { type: String, default: "" },
});

defineEmits(["click"]);
</script>

<template>
  <button
    class="btn btn-sm"
    :class="`btn-outline-${variant}`"
    :title="title"
    @click="$emit('click')"
  >
    <Icon :icon="icon" :width="16" :height="16" />
  </button>
</template>
