<script setup lang="ts">
defineProps<{
  items: Array<{ id: string; name: string }>;
}>();

defineEmits<{
  (e: "select", item: { id: string; name: string }): void;
}>();
</script>

<template>
  <div class="selection-grid">
    <div
      class="selection-card"
      v-for="item in items"
      :key="item.id"
      @click="$emit('select', item)"
    >
      <img :src="`/${item.id}.webp`" :alt="item.name" class="selection-image" />
      <span class="selection-text"> {{ item.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.selection-grid {
  max-width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.selection-card {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 10px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.selection-card:hover {
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.selection-image {
  width: 100%;
  display: block;
}

.selection-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5em;
  font-size: clamp(1em, 2vw, 1.2em);
}
</style>
