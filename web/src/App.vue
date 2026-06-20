<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <header>
    <notifications classes="custom-notification" position="top center" />
    <NavBar />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <small>Tricky Madness - Leaderboards</small>
  </footer>
</template>
