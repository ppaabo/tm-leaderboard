<script setup lang="ts"></script>

<template>
  <b>Login page</b>
  <p>Don't have an account?</p>
  <router-link :to="{ name: 'signup' }">
    <button>Create account</button>
  </router-link>
</template>

<style scoped></style>
