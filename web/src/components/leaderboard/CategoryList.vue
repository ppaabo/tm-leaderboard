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
  <div>
    <h2 v-if="title">{{ title }}</h2>
    <ul>
      <li v-for="item in items" :key="item.id">
        <button @click="$emit('select', item)">
          {{ item.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
