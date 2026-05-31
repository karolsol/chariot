<script setup lang="ts">
import { useModalStore } from "../stores/modalStore";
import { computed } from "vue";

const store = useModalStore();
const componentProps = computed(() => store.modalProps || {});
const componentListeners = computed(() => store.modalFunctions || {});
</script>

<template>
  <div v-if="store.activeModal" class="modal-backdrop fade show"></div>
  <div v-if="store.activeModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <component
          :is="store.activeModal"
          v-bind="componentProps"
          v-on="componentListeners"
          @close="store.close"
        />
      </div>
    </div>
  </div>
</template>