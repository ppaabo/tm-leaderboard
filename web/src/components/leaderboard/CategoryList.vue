<script setup lang="ts">
defineProps<{
  items: Array<{ id: string; name: string }>;
  layout: string;
}>();

defineEmits<{
  (e: "select", item: { id: string; name: string }): void;
}>();
</script>

<template>
  <div :class="['button-container', layout]">
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

.selection-row {
  max-width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
}

.selection-row > * {
  flex: 1 1 0;
}

.selection-grid {
  max-width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
</style>
