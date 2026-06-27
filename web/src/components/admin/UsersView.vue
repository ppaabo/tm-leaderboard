<script setup lang="ts">
import type { UserList } from "shared";
import { useUserStore } from "@/stores/user-store";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserTable from "./UserTable.vue";

const router = useRouter();
const userStore = useUserStore();
const userList = ref<UserList>([]);

const handleSelect = (username: string) => {
  router.push({ name: "user", params: { username } });
};

const handleDelete = (userId: string) => {
  console.log("Deleting user: ", userId);
};

onMounted(async () => {
  const data: UserList | null = await userStore.getAllUsers();
  if (data === null) {
    console.error("getAllUsers returned null");
    return;
  }
  userList.value = data;
});
</script>

<template>
  <h1>All users</h1>
  <UserTable :users="userList" @select="handleSelect" @delete="handleDelete" />
</template>
