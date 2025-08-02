<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth-store";
import NavBar from "./components/NavBar.vue";

const authStore = useAuthStore();
onMounted(() => {
  authStore.refreshSession();
});
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
