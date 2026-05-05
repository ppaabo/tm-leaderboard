<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import type { SignUpValidationState } from "@/types";
import { signUpSchema } from "@/types";
import type { RegisterPayload } from "shared";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const usernameInput = ref("");
const emailInput = ref("");
const passwordInput = ref("");
const passwordConfirmInput = ref("");
const hasSubmitted = ref(false);
const router = useRouter();

// Basic validation stuff for displaying validation states
// field: false = value is valid (aria-invalid=false)
const validation = reactive<SignUpValidationState>({
  username: undefined,
  email: undefined,
  password: undefined,
  passwordConfirm: undefined,
});

const validateForm = () => {
  // reset validation state
  validation.username = false;
  validation.email = false;
  validation.password = false;
  validation.passwordConfirm = false;

  const result = signUpSchema.safeParse({
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    passwordConfirm: passwordConfirmInput.value,
  });

  if (!result.success) {
    result.error.issues.forEach((err) => {
      if (err.path.includes("username")) validation.username = true;
      if (err.path.includes("email")) validation.email = true;
      if (err.path.includes("password") && err.path.length === 1)
        validation.password = true;
      if (err.path.includes("passwordConfirm"))
        validation.passwordConfirm = true;
    });
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  hasSubmitted.value = true;
  if (!validateForm()) return;

  const user: RegisterPayload = {
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
  const success = await authStore.signUpUser(user);
  if (success) {
    router.push({ name: "home" });
  }
};
watch([usernameInput, emailInput, passwordInput, passwordConfirmInput], () => {
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
          <small v-if="validation.username" id="username-helper">
            Username must be at least 4 characters
          </small>
        </label>
        <label>
          Email
          <input
            v-model.trim="emailInput"
            type="email"
            name="email"
            placeholder="email"
            autocomplete="email"
            required
            :aria-invalid="validation.email"
            aria-describedby="email-helper"
          />
          <small v-if="validation.email" id="email-helper">
            Please provide a valid email address!
          </small>
        </label>
        <label>
          Password
          <input
            v-model="passwordInput"
            type="password"
            name="password"
            placeholder="password"
            autocomplete="new-password"
            required
            :aria-invalid="validation.password"
            aria-describedby="password-helper"
          />
          <small v-if="validation.password" id="password-helper">
            Password must be at least 8 characters
          </small>
        </label>
        <label>
          Confirm Password
          <input
            v-model="passwordConfirmInput"
            type="password"
            name="passwordConfirm"
            placeholder="confirm password"
            autocomplete="new-password"
            required
            :aria-invalid="validation.passwordConfirm"
            aria-describedby="password-confirm-helper"
          />
          <small v-if="validation.passwordConfirm" id="password-confirm-helper">
            Passwords do not match
          </small>
        </label>
      </fieldset>
      <button
        type="submit"
        :disabled="
          validation.username ||
          validation.email ||
          validation.password ||
          validation.passwordConfirm
        "
      >
        Sign Up
      </button>
    </form>
    <small>Already have an account?</small>
    <br />
    <router-link :to="{ name: 'login' }">
      <small>Log in</small>
    </router-link>
  </article>
</template>

<style scoped></style>
