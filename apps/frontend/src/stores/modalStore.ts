import { defineStore } from "pinia";
import { ref, markRaw, type Component } from "vue";

export const useModalStore = defineStore("modal", () => {
  const activeModal = ref<Component | null>(null);
  const modalProps = ref<Record<string, any>>({});
  const modalFunctions = ref<Record<string, void>>({});

  type modalPayload = {
    props?: Record<string, any>;
    functions?: Record<string, any>;
  };

  function open(component: Component, payload: modalPayload): void {
    activeModal.value = markRaw(component);
    modalProps.value = payload.props || {};
    modalFunctions.value = payload.functions || {};
  }

  function close(): void {
    activeModal.value = null;
    modalProps.value = {};
  }

  return { activeModal, modalProps, modalFunctions, open, close };
});
