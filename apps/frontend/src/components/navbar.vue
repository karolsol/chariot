<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useThemeStore } from "../stores/themeStore";

const userStore = useUserStore();
const themeStore = useThemeStore();

const isExpanded = ref(false);

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value;
};

const closeMenu = () => {
  isExpanded.value = false;
};

onMounted(() => {
  themeStore.fetchInfo();
});

const handleLogout = () => {
  closeMenu();
  userStore.logout();
};
</script>

<template>
  <nav
    class="navbar navbar-expand-lg bg-body-tertiary border-bottom shadow-sm sticky-top"
  >
    <div class="container">
      <router-link
        to="/"
        class="navbar-brand fw-bold d-flex align-items-center gap-2"
        @click="closeMenu"
      >
        <Icon
          icon="fa-solid:car"
          class="text-primary"
        />
        <span>Chariot</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div
        id="navbarNav"
        class="collapse navbar-collapse"
        :class="{ show: isExpanded }"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 pt-2 pt-lg-0">
          <li class="nav-item">
            <router-link
              to="/vehicles"
              class="nav-link px-3"
              active-class="active fw-semibold text-primary"
              @click="closeMenu"
            >
              Vehicles
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/refuels"
              class="nav-link px-3"
              active-class="active fw-semibold text-primary"
              @click="closeMenu"
            >
              Refuels
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/maintenance"
              class="nav-link px-3"
              active-class="active fw-semibold text-primary"
              @click="closeMenu"
            >
              Maintenance
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3 pt-3 pt-lg-0">
          <button
            class="btn btn-link nav-link p-2 d-flex align-items-center justify-content-center"
            @click="themeStore.toggleTheme"
          >
            <Icon
              v-if="themeStore.theme === 'dark'"
              icon="fa-solid:moon"
              class="fs-5 text-info"
            />
            <Icon
              v-else
              icon="fa-solid:sun"
              class="fs-5 text-warning"
            />
          </button>

          <button
            class="btn btn-outline-secondary btn-sm w-100 w-lg-auto px-3"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
