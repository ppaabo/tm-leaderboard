<script setup lang="ts">
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "vue-router";
import { ref } from "vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

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
  <h2>Account Settings</h2>
  <button @click="openConfirmModal">Delete Account</button>
  <dialog :open="showConfirmModal">
    <article>
      <header>
        <h2>Confirm Account Deletion</h2>
      </header>
      <p>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <p>
        Deleting your account also deletes all your scores from the leaderboards
      </p>
      <LoadingIndicator
        v-if="isDeleting"
        inline
        message="Deleting account..."
      />
      <footer>
        <button class="secondary" @click="cancelDelete" :disabled="isDeleting">
          Cancel
        </button>
        <button @click="confirmDelete" :disabled="isDeleting">Confirm</button>
      </footer>
    </article>
  </dialog>
</template>
