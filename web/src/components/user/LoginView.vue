<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { logInSchema, type LoginValidationState } from "@/types";
import type { LoginPayload } from "shared";
import { reactive, ref, watch } from "vue";
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

const validateForm = () => {
  validation.username = false;
  validation.password = false;

  const result = logInSchema.safeParse({
    username: usernameInput.value,
    password: passwordInput.value,
  });

  if (!result.success) {
    result.error.issues.forEach((err) => {
      if (err.path.includes("username")) validation.username = true;
      if (err.path.includes("password")) validation.password = true;
    });
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  hasSubmitted.value = true;
  if (!validateForm()) return;
  const user: LoginPayload = {
    username: usernameInput.value,
    password: passwordInput.value,
  };
  const success = await authStore.loginUser(user);
  if (success) {
    router.push({ name: "home" });
  }
};

watch([usernameInput, passwordInput], () => {
  if (hasSubmitted.value) validateForm();
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
