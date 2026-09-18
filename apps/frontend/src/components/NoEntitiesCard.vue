<script setup lang="ts">
defineProps<{ mainText: string; secondaryText: string }>();
</script>

<template>
  <div class="text-center py-5 border rounded shadow-sm">
    <h4 class="text-secondary">
      {{ mainText }}
    </h4>
    <p class="text-muted">
      {{ secondaryText }}
    </p>
  </div>
</template>
