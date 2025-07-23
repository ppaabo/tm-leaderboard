<script setup lang="ts">
defineProps<{ msg: string }>();

const fetchTest = async (): Promise<void> => {
  const res = await fetch("/api/scores");
  const resJson = await res.json();
  console.log(resJson);
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="card">
    <button type="button" @click="fetchTest">Fetch</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
