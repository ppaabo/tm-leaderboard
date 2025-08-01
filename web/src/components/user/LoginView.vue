<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginPayload } from "@/types";

const authStore = useAuthStore();
const usernameInput = ref("");
const passwordInput = ref("");

const loginUser = () => {
  const user: LoginPayload = {
    username: usernameInput.value,
    password: passwordInput.value,
  };
  authStore.loginUser(user);
};
</script>

<template>
  <article>
    <body>
      <form @submit.prevent="loginUser">
        <fieldset>
          <label>
            Username
            <input
              v-model.trim="usernameInput"
              name="first_name"
              placeholder="username"
              autocomplete="username"
            />
          </label>
          <label>
            Password
            <input
              v-model.trim="passwordInput"
              type="password"
              name="email"
              placeholder="password"
              autocomplete="current-password"
            />
          </label>
        </fieldset>
        <button type="submit">Login</button>
      </form>
    </body>
    <footer>
      <p>Don't have an account?</p>
      <router-link :to="{ name: 'signup' }">
        <button>Create account</button>
      </router-link>
    </footer>
  </article>
</template>

<style scoped></style>
