<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useModalStore } from "../stores/modalStore";
import { computed } from "vue";

const store = useModalStore();
const componentProps = computed(() => {
  const { title, icon, variant, ...rest } = store.modalProps;
  return rest;
});
</script>

<template>
  <div v-if="store.activeModal" class="modal-backdrop fade show"></div>
  <div v-if="store.activeModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <Icon
            v-if="store.modalProps.icon"
            :icon="store.modalProps.icon"
            class="fs-4 me-3"
            :class="`text-${store.modalProps.variant || 'primary'}`"
          />
          <h5 class="modal-title mb-0">
            {{ store.modalProps.title }}
          </h5>
          <button type="button" class="btn-close" @click="store.close" />
        </div>
        <component
          :is="store.activeModal"
          v-bind="componentProps"
          @close="store.close"
        />
      </div>
    </div>
  </div>
</template>