<script setup lang="ts">
import Navbar from "./components/navbar.vue";
import { useRoute } from "vue-router";
import BaseModal from "./components/BaseModal.vue";
const route = useRoute();
</script>
<template>
  <navbar v-if="!route.meta.hideNavbar" />
  <router-view />
  <BaseModal />
</template>