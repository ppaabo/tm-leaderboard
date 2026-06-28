<script setup lang="ts">
import UserTable from "@/components/admin/UserTable.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { useUserStore } from "@/stores/user-store";
import { DeleteUserAccountStatus } from "@/types";
import type { UserList } from "shared";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const userList = ref<UserList>([]);
const isLoading = ref(false);
const isDeleting = ref(false);
const pendingDeleteUserId = ref<string | null>(null);

const fetchAllUsers = async () => {
  isLoading.value = true;
  const data: UserList | null = await userStore.getAllUsers();
  if (data === null) {
    isLoading.value = false;
    console.error("getAllUsers returned null");
    return;
  }
  userList.value = data;
  isLoading.value = false;
};

const handleSelect = (username: string) => {
  router.push({ name: "user", params: { username } });
};

const handleDelete = (userId: string) => {
  pendingDeleteUserId.value = userId;
};

const cancelDelete = () => {
  pendingDeleteUserId.value = null;
};

const confirmDelete = async () => {
  const userId = pendingDeleteUserId.value;
  if (!userId) return;
  isDeleting.value = true;
  try {
    const result = await userStore.deleteUserAccount(userId);
    if (
      result === DeleteUserAccountStatus.Deleted ||
      result === DeleteUserAccountStatus.NotFound
    )
      await fetchAllUsers();
  } finally {
    isDeleting.value = false;
    pendingDeleteUserId.value = null;
  }
};

onMounted(async () => {
  await fetchAllUsers();
});
</script>

<template>
  <h1>All users</h1>
  <LoadingIndicator v-if="isLoading" message="Loading users..." />
  <template v-else>
    <UserTable
      :users="userList"
      @select="handleSelect"
      @delete="handleDelete"
    />
    <ConfirmDialog
      :open="pendingDeleteUserId !== null"
      title="Confirm User Deletion"
      message="Are you sure you want to delete this user? This action cannot be undone."
      :loading="isDeleting"
      loadingMessage="Deleting user..."
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </template>
</template>
