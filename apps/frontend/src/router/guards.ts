import type { Router } from "vue-router";
import type { Pinia } from "pinia";
import { useUserStore } from "../stores/userStore";

export function setupGuards(router: Router, pinia: Pinia): void {
  router.beforeEach(async (to) => {
    const userStore = useUserStore(pinia);

    if (to.meta.public) {
      return;
    }

    if (!userStore.isAuthenticated) {
      await userStore.fetchInfo();
    }

    if (!userStore.isAuthenticated) {
      return { path: "/login", query: { redirect: to.fullPath } };
    }
  });
}
