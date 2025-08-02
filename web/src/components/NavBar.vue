<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
</script>

<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{ name: 'home' }"> Home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'gamemodes' }"> Leaderboard</router-link>
      </li>
    </ul>
    <ul>
      <li v-if="!authStore.currentUser">
        <router-link :to="{ name: 'login' }">Login</router-link>
      </li>
      <li v-else>{{ authStore.currentUser.username }}</li>
    </ul>
  </nav>
</template>
