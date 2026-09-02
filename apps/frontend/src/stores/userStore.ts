import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api";
import router from "../router";
import { type IUser, SignInDto } from "@chariot/shared";

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

  async function login(loginDto: SignInDto): Promise<void> {
    try {
      await api.post("/auth/login", loginDto);
      await fetchInfo();
      await router.push("/");
    } catch {
      user.value = null;
      isAuthenticated.value = false;
      return Promise.reject(
        new Error("Invalid credentials. Please try again."),
      );
    }
  }

  async function logout(): Promise<void> {
    await api.post("/auth/logout");
    user.value = null;
    isAuthenticated.value = false;
    await router.push("/login");
  }

  return { user, isAuthenticated, fetchInfo: fetchInfo, login, logout };
});
