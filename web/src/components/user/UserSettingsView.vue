<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useUserStore } from "@/stores/user-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const showConfirmModal = ref(false);
const isDeleting = ref(false);

const openConfirmModal = () => {
  showConfirmModal.value = true;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  const success = await userStore.deleteOwnAccount();
  isDeleting.value = false;
  showConfirmModal.value = false;
  if (success) {
    router.push({ name: "home" });
  }
};

const cancelDelete = () => {
  showConfirmModal.value = false;
};
</script>

<template>
  <h1>Settings</h1>
  <hr />
  <h2>Account Settings</h2>
  <button @click="openConfirmModal">Delete Account</button>
  <ConfirmDialog
    v-model:open="showConfirmModal"
    title="Confirm Account Deletion"
    message="Are you sure you want to delete your account? This action cannot be undone."
    :loading="isDeleting"
    loadingMessage="Deleting account..."
    @cancel="cancelDelete"
    @confirm="confirmDelete"
  >
    <p>
      Deleting your account also deletes all your scores from the leaderboards
    </p>
  </ConfirmDialog>
</template>
