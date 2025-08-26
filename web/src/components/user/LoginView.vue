<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginValidationState } from "@/types";
import type { LoginPayload } from "shared";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const usernameInput = ref("");
const passwordInput = ref("");
const hasSubmitted = ref(false);
const router = useRouter();
const validation = reactive<LoginValidationState>({
  username: undefined,
  password: undefined,
});
const validateUsername = () => {
  const value = usernameInput.value.trim();
  validation.username = value.length >= 4 ? false : true;
};
const validatePassword = () => {
  const value = passwordInput.value;
  validation.password = value.length > 0 ? false : true;
};

const handleSubmit = async () => {
  hasSubmitted.value = true;
  validateUsername();
  validatePassword();
  if (!validation.username && !validation.password) {
    const user: LoginPayload = {
      username: usernameInput.value,
      password: passwordInput.value,
    };
    const success = await authStore.loginUser(user);
    if (success) {
      router.push({ name: "home" });
    }
  }
};

watch(usernameInput, () => {
  if (hasSubmitted.value) validateUsername();
});
watch(passwordInput, () => {
  if (hasSubmitted.value) validatePassword();
});
</script>

<template>
  <article>
    <form @submit.prevent="handleSubmit">
      <fieldset>
        <label>
          Username
          <input
            v-model.trim="usernameInput"
            name="username"
            placeholder="username"
            autocomplete="username"
            required
            :aria-invalid="validation.username"
            aria-describedby="username-helper"
          />
          <small v-if="validation.username" id="username-helper"
            >Username must be atleast 4 characters</small
          >
        </label>
        <label>
          Password
          <input
            v-model="passwordInput"
            type="password"
            name="password"
            placeholder="password"
            autocomplete="current-password"
            required
            :aria-invalid="validation.password"
            aria-describedby="password-helper"
          />
          <small v-if="validation.password" id="password-helper">
            Please enter your password
          </small>
        </label>
      </fieldset>
      <button
        type="submit"
        :disabled="validation.username || validation.password"
      >
        Log in
      </button>
    </form>
    <small>Don't have an account?</small>
    <br />
    <router-link :to="{ name: 'signup' }">
      <small>Create account</small>
    </router-link>
  </article>
</template>

<style scoped></style>
