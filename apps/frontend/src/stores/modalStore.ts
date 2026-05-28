import { defineStore } from "pinia";
import { ref, markRaw, type Component } from "vue";

export const useModalStore = defineStore("modal", () => {
  const activeModal = ref<Component | null>(null);
  const modalProps = ref<Record<string, any>>({});

  type Variant =
    | "danger"
    | "warning"
    | "success"
    | "info"
    | "primary"
    | "secondary";

  type modalProps = {
    title: string;
    icon?: string;
    variant: Variant;
  } & Record<string, any>;

  function open(component: Component, props: modalProps): void {
    activeModal.value = markRaw(component);
    modalProps.value = props;
  }

  function close(): void {
    activeModal.value = null;
    modalProps.value = {};
  }

  return { activeModal, modalProps, open, close };
});
