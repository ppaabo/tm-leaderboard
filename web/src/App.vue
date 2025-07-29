<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <header>
    <NavBar />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <small>Footer</small>
  </footer>
</template>

<style scoped></style>
