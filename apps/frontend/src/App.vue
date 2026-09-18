<script setup lang="ts">
import Navbar from "./components/navbar.vue";
import { useRoute } from "vue-router";
import BaseModal from "./components/modals/BaseModal.vue";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <div
    v-if="!(userStore.isAuthenticated || route.meta.hideNavbar)"
    class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-body"
    style="z-index: 9999"
  >
    <div
      class="spinner-border text-primary"
      role="status"
      style="width: 3rem; height: 3rem"
    />
  </div>
  <navbar v-if="!route.meta.hideNavbar" />
  <router-view />
  <BaseModal />
</template>
