<script setup lang="ts">
defineProps<{ username?: string }>();
const emit = defineEmits<{
  (e: "logout"): void;
}>();
</script>

<template>
  <details class="dropdown">
    <summary role="button" class="outline">
      {{ username }}
    </summary>
    <ul>
      <li>
        <router-link :to="{ name: 'user', params: { username } }">
          Profile
        </router-link>
      </li>

      <li>
        <router-link :to="{ name: 'settings' }">Settings</router-link>
      </li>

      <li>
        <a href="#" @click.prevent="emit('logout')">Logout</a>
      </li>
    </ul>
  </details>
</template>
