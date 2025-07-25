<script setup lang="ts">
const props = defineProps<{
  items: Array<{ id: string; name: string }>;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "select", item: { id: string; name: string }): void;
}>();
</script>

<template>
  <h2 v-if="title">{{ title }}</h2>
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
