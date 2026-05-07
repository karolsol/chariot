<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import router from "../router";

let theme = ref(localStorage.getItem("theme") || "light");

const changeTheme = () => {
  theme.value = localStorage.getItem("theme") === "dark" ? "light" : "dark";
  updateTheme();
};

const updateTheme = () => {
  document.documentElement.setAttribute("data-bs-theme", theme.value);
  localStorage.setItem("theme", theme.value);
};

onMounted(() => {
  updateTheme();
});

const handleLogout = () => {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      console.log("Successfully logged out!");
      router.push("/login");
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/vehicles" class="nav-link">Vehicles</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/refuels" class="nav-link">Refuels</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/maintenance" class="nav-link"
              >Maintenance</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link btn ms-2 fs-4" @click="changeTheme">
              <Icon icon="fa-solid:moon" v-if="theme == 'dark'" />
              <Icon icon="fa-solid:sun" v-if="theme == 'light'" />
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link btn btn-outline-light ms-2" @click="handleLogout"
              >Logout</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
