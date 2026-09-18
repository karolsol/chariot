<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleBack = () => {
  router.go(-1);
};
</script>
<template>
  <div
    class="d-flex align-items-center justify-content-center min-vh-100 text-center"
  >
    <div class="container">
      <div class="mb-3 text-warning">
        <Icon
          icon="mdi:alert-circle-outline"
          style="font-size: 80px"
        />
      </div>

      <h1 class="display-1 fw-bold mb-2">
        404
      </h1>

      <h2 class="h4 fw-semibold text-secondary mb-3">
        Page does not exist
      </h2>

      <p
        class="text-muted mb-4 mx-auto"
        style="max-width: 450px"
      >
        Page you are looking for does not exist or was moved to another path.
      </p>

      <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center">
        <router-link
          to="/"
          class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4"
        >
          <Icon icon="mdi:home" />
          Home page
        </router-link>

        <button
          class="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center gap-2 px-4"
          @click="handleBack"
        >
          <Icon icon="mdi:arrow-left" />
          Go back
        </button>
      </div>
    </div>
  </div>
</template>
