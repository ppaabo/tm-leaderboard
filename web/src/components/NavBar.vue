<script setup lang="ts">
import NavBarDropdown from "@/components/NavBarDropdown.vue";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logoutUser();
  router.push({ name: "home" });
};
</script>

<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{ name: 'home' }"> Home</router-link>
      </li>
      |
      <li>
        <router-link :to="{ name: 'gamemodes' }"> Leaderboard</router-link>
      </li>
      |
      <li>
        <router-link :to="{ name: 'submit' }">Submit Score</router-link>
      </li>
    </ul>
    <ul>
      <li v-if="!authStore.isAuthenticated">
        <router-link :to="{ name: 'login' }">Login</router-link>
      </li>
      <li v-else>
        <NavBarDropdown
          :username="authStore.currentUser?.username"
          @logout="handleLogout"
        />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  border-bottom: 2px solid var(--pico-muted-border-color);
}

/* fix for firefox (https://github.com/picocss/pico/issues/701#issuecomment-3367167118) */
nav li details.dropdown {
  display: inline-block;
}
</style>
