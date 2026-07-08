import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref("dark");
  function fetchInfo() {
    let storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        storedTheme = "dark";
      } else {
        storedTheme = "light";
      }
    }
    document.documentElement.setAttribute("data-bs-theme", storedTheme);
  }

  function toggleTheme() {
    if (theme.value === "dark") {
      theme.value = "light";
    } else {
      theme.value = "dark";
    }
    document.documentElement.setAttribute("data-bs-theme", theme.value);
    localStorage.setItem("theme", theme.value);
  }
  return { theme, fetchInfo, toggleTheme };
});
