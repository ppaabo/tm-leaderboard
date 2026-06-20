<script setup lang="ts">
import type { UserList } from "shared";
import { useUserStore } from "@/stores/user-store";
import { ref, onMounted } from "vue";

const userStore = useUserStore();
const userList = ref<UserList>([]);

onMounted(async () => {
  const data: UserList | null = await userStore.getAllUsers();
  if (data === null) {
    console.error("getAllUsers returned null");
    return;
  }
  userList.value = data;
  console.log(data);
});
</script>

<template>
  <h1>All users</h1>
  <ul>
    <li v-for="(user, idx) in userList" :key="idx">
      <pre>
      {{ JSON.stringify(user) }}
      </pre>
    </li>
  </ul>
</template>

<style scoped></style>
