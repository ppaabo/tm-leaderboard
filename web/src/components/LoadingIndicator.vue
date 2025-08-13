<script setup lang="ts">
defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>

<template>
  <span v-if="inline" aria-busy="true">{{ message }}</span>
  <div v-else aria-busy="true" class="loading-container">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.loading-container {
  min-height: 500px;
}
</style>
