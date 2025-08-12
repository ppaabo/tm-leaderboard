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
      <li v-if="!authStore.currentUser">
        <router-link :to="{ name: 'login' }">Login</router-link>
      </li>
      <li v-else>
        <details class="dropdown">
          <summary role="button" class="outline">
            {{ authStore.currentUser.username }}
          </summary>
          <ul>
            <li><a href="#">Profile</a></li>
            <li>
              <a href="#" @click.prevent="authStore.logoutUser">Logout</a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</template>
