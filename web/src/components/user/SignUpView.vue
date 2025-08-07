<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useAuthStore } from "@/stores/auth-store";
import type { RegisterPayload, SignUpValidationState } from "@/types";
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
const validateUsername = () => {
  const value = usernameInput.value.trim();
  validation.username = value.length >= 4 ? false : true;
};
const validateEmail = () => {
  const value = emailInput.value.trim();
  validation.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? false : true;
};
const validatePassword = () => {
  const value = passwordInput.value;
  validation.password = value.length >= 6 ? false : true;
};
const validatePasswordConfirm = () => {
  const pass = passwordInput.value;
  const confirm = passwordConfirmInput.value;
  if (pass.length < 6 || confirm.length === 0) {
    validation.passwordConfirm = true;
  } else {
    validation.passwordConfirm = pass === confirm ? false : true;
  }
};

const handleSubmit = async () => {
  // Show validation states after user submits for the first time
  hasSubmitted.value = true;
  validateUsername();
  validateEmail();
  validatePassword();
  validatePasswordConfirm();
  if (
    !validation.username &&
    !validation.email &&
    !validation.password &&
    !validation.passwordConfirm
  ) {
    const user: RegisterPayload = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };
    const success = await authStore.signUpUser(user);
    if (success) router.push({ name: "home" });
  }
};

watch(usernameInput, () => {
  if (hasSubmitted.value) validateUsername();
});
watch(emailInput, () => {
  if (hasSubmitted.value) validateEmail();
});
watch(passwordInput, () => {
  if (hasSubmitted.value) {
    validatePassword();
    validatePasswordConfirm();
  }
});
watch(passwordConfirmInput, () => {
  if (hasSubmitted.value) validatePasswordConfirm();
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
            Password must be at least 6 characters
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
