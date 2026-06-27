<script setup lang="ts">
import type { UserList } from "shared";

defineProps<{ users: UserList }>();

defineEmits<{
  (e: "select", username: string): void;
  (e: "delete", userId: string): void;
}>();
</script>

<template>
  <p v-if="!users || users.length === 0">No users found</p>
  <table v-else class="striped">
    <thead>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Account Type</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in users"
        :key="user.id"
        @click="$emit('select', user.username)"
        class="clickable-row"
        :title="`View ${user.username}'s profile`"
      >
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.accountType }}</td>
        <td title="Delete user">
          <button class="delete-btn" @click.stop="$emit('delete', user.id)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
