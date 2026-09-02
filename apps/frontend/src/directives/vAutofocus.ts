import type { Directive } from "vue";

export const vAutofocus: Directive = {
  mounted: (el: HTMLElement) => {
    setTimeout(() => {
      if (el) {
        el.focus({ focusVisible: true });
      }
    }, 0);
  },
};
