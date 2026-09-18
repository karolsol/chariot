<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>
<template>
  <div class="text-center py-5 border rounded shadow-sm">
    <h4 class="text-danger">
      <Icon
        icon="mdi:alert"
        width="24"
        height="24"
      />
      Error while fetching data
    </h4>
    <p class="text-muted">
      Check logs for further info.
    </p>
  </div>
</template>
