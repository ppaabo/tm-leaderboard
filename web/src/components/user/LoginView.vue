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
    <form @submit.prevent="loginUser">
      <fieldset>
        <label>
          Username
          <input
            v-model.trim="usernameInput"
            name="username"
            placeholder="username"
            autocomplete="username"
          />
        </label>
        <label>
          Password
          <input
            v-model="passwordInput"
            type="password"
            name="password"
            placeholder="password"
            autocomplete="current-password"
          />
        </label>
      </fieldset>
      <button type="submit">Login</button>
    </form>
    <small>Don't have an account?</small>
    <br />
    <router-link :to="{ name: 'signup' }">
      <small>Create account</small>
    </router-link>
  </article>
</template>

<style scoped></style>
