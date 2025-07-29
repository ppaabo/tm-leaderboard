<script setup lang="ts"></script>

<template>
  <b>Signup page</b>
  <p>Already registered?</p>
  <router-link :to="{ name: 'login' }">
    <button>Log in</button>
  </router-link>
</template>

<style scoped></style>
