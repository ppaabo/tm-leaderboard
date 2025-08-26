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

<style lang="scss">
.vue-notification-group {
  padding-top: 1rem;
}

.custom-notification {
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 12px;
  color: #ffffff;
  border-radius: 0.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 5px solid;
  position: relative;
  cursor: pointer;

  .notification-title {
    font-weight: bold;
    padding-right: 20px;
  }

  &.success {
    background: var(--pico-color-jade-700);
    border-left-color: var(--pico-color-jade-500);
  }

  &.error {
    background: var(--pico-color-red-700);
    border-left-color: var(--pico-color-red-500);
  }
  &.info {
    background: var(--pico-color-cyan-700);
    border-left-color: var(--pico-color-cyan-500);
  }

  /* close button */
  &::after {
    content: "×";
    position: absolute;
    top: 6px;
    right: 10px;
    font-size: 16px;
    font-weight: bold;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
