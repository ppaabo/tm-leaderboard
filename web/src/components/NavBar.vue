<script setup lang="ts">
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
        <details class="dropdown">
          <summary role="button" class="outline">
            {{ authStore.currentUser?.username }}
          </summary>
          <ul>
            <li>
              <router-link
                :to="{
                  name: 'user',
                  params: { username: authStore.currentUser?.username },
                }"
                >Profile</router-link
              >
            </li>
            <li>
              <router-link :to="{ name: 'settings' }">Settings</router-link>
            </li>
            <li>
              <a href="#" @click.prevent="handleLogout">Logout</a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</template>
