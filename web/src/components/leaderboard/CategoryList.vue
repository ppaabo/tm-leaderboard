<script setup lang="ts">
defineProps<{
  items: Array<{ id: string; name: string }>;
}>();

defineEmits<{
  (e: "select", item: { id: string; name: string }): void;
}>();
</script>

<template>
  <div class="button-container">
    <button
      v-for="item in items"
      :key="item.id"
      class="outline category-btn"
      @click="$emit('select', item)"
    >
      {{ item.name }}
    </button>
  </div>
</template>
<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-btn {
  width: auto;
  min-width: 200px;
  margin-bottom: 0.5rem;
}
</style>
