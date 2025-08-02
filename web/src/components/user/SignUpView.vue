<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth-store";
import type { RegisterPayload } from "@/types";

const authStore = useAuthStore();

const usernameInput = ref("");
const emailInput = ref("");
const passwordInput = ref("");
const passwordConfirmInput = ref("");

// For displaying validation states & basic validation of inputs
const usernameTouched = ref(false);
const emailTouched = ref(false);
const passwordTouched = ref(false);
const passwordConfirmTouched = ref(false);
const isUsernameValid = computed(() => usernameInput.value.length >= 3);
const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
);
const isPasswordValid = computed(() => passwordInput.value.length >= 6);
const isPasswordMatch = computed(
  () =>
    passwordInput.value === passwordConfirmInput.value &&
    passwordInput.value.length > 0
);
const isPasswordConfirmInvalid = computed(
  () =>
    passwordConfirmTouched.value &&
    isPasswordValid.value &&
    !isPasswordMatch.value
);

const handleSubmit = async () => {
  if (
    !isUsernameValid.value ||
    !isEmailValid.value ||
    !isPasswordValid.value ||
    !isPasswordMatch.value
  ) {
    return;
  }
  const user: RegisterPayload = {
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
  await authStore.signUpUser(user);
};
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
            aria-label="username"
            placeholder="username"
            autocomplete="username"
            required
            @input="usernameTouched = true"
            :aria-invalid="usernameTouched ? !isUsernameValid : undefined"
            aria-describedby="username-helper"
          />
          <small
            v-if="usernameTouched && !isUsernameValid"
            id="username-helper"
          >
            Username must be at least 3 characters
          </small>
        </label>
        <label>
          Email
          <input
            v-model.trim="emailInput"
            type="email"
            name="email"
            aria-label="email"
            placeholder="email"
            autocomplete="email"
            required
            @input="emailTouched = true"
            :aria-invalid="emailTouched ? !isEmailValid : undefined"
            aria-describedby="email-helper"
          />
          <small v-if="emailTouched && !isEmailValid" id="email-helper">
            Please provide a valid email address!
          </small>
        </label>
        <label>
          Password
          <input
            v-model="passwordInput"
            type="password"
            name="password"
            aria-label="password"
            placeholder="password"
            autocomplete="new-password"
            required
            @input="passwordTouched = true"
            :aria-invalid="passwordTouched ? !isPasswordValid : undefined"
            aria-describedby="password-helper"
          />
          <small
            v-if="passwordTouched && !isPasswordValid"
            id="password-helper"
          >
            Password must be at least 6 characters
          </small>
        </label>
        <label>
          Confirm Password
          <input
            v-model="passwordConfirmInput"
            type="password"
            name="passwordConfirm"
            aria-label="confirm password"
            placeholder="confirm password"
            autocomplete="new-password"
            required
            @input="passwordConfirmTouched = true"
            :aria-invalid="
              passwordConfirmTouched
                ? !(isPasswordValid && isPasswordMatch)
                : undefined
            "
            aria-describedby="password-confirm-helper"
          />
          <small v-if="isPasswordConfirmInvalid" id="password-confirm-helper">
            Passwords do not match
          </small>
        </label>
      </fieldset>
      <button
        type="submit"
        :disabled="
          !isUsernameValid ||
          !isEmailValid ||
          !isPasswordValid ||
          !isPasswordMatch
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
