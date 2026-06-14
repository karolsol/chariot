import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api.ts";
import router from "../router";
import type { IUser } from "@chariot/shared";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUser | null>(null);
  const isAuthenticated = ref(false);

  async function fetchInfo(): Promise<void> {
    try {
      const { data } = await api.get<IUser>("/auth/info", {
        withCredentials: true,
      });
      user.value = data;
      isAuthenticated.value = true;
    } catch {
      user.value = null;
      isAuthenticated.value = false;
    }
  }

  async function logout(): Promise<void> {
    await api.post("/auth/logout");
    user.value = null;
    isAuthenticated.value = false;
    await router.push("/login");
  }

  return { user, isAuthenticated, fetchInfo: fetchInfo, logout };
});
