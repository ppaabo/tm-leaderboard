<script setup lang="ts">
import { watch, ref, computed } from "vue";
import {
  type LeaderboardEntryData,
  type LeaderboardEntryDisplay,
  DeleteOwnScoreStatus,
} from "@/types";
import UserScores from "./UserScores.vue";
import { formatTimeTrialScore } from "@/utils/score-format";
import { useScoreStore } from "@/stores/score-store";
import { useCategoryStore } from "@/stores/category-store";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "vue-router";
import LoadingIndicator from "../LoadingIndicator.vue";

const props = defineProps<{ username: string }>();
const userScores = ref<LeaderboardEntryDisplay[]>([]);
const userNotFound = ref(false);
const isLoading = ref(true);
const scoreStore = useScoreStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const router = useRouter();

const isDeletingScore = ref(false);
// controls whether dialog is shown
const pendingDeleteScoreId = ref<string | null>(null);

const fetchUserScores = async () => {
  isLoading.value = true;
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryData[] | null = await scoreStore.getScoresByUser(
    props.username,
  );
  if (data === null) {
    userNotFound.value = true;
    router.push("/");
  } else {
    userScores.value = data.map((entry) => ({
      ...entry,
      rawScore: entry.score,
      score:
        entry.gamemode === "time-trial"
          ? formatTimeTrialScore(entry.score)
          : entry.score.toLocaleString("en-US"),
    }));
    userNotFound.value = false;
  }
  isLoading.value = false;
};

watch(() => props.username, fetchUserScores, { immediate: true });

const formattedUsername = computed(() => {
  return userScores.value.length > 0
    ? userScores.value[0].user.username
    : props.username;
});

const handleScoreClick = (item: { gamemode: string; map: string }) => {
  router.push({
    name: "leaderboard",
    params: {
      gamemode: item.gamemode,
      map: item.map,
    },
  });
};

const handleDeleteScore = async (scoreId: string) => {
  pendingDeleteScoreId.value = scoreId;
};

const cancelDeleteScore = () => {
  pendingDeleteScoreId.value = null;
};

const confirmDeleteScore = async () => {
  if (!pendingDeleteScoreId.value) return;

  isDeletingScore.value = true;
  try {
    const result = await scoreStore.deleteOwnScore(pendingDeleteScoreId.value);
    switch (result) {
      case DeleteOwnScoreStatus.Deleted:
      case DeleteOwnScoreStatus.NotFound:
        await fetchUserScores();
        break;
    }
  } finally {
    isDeletingScore.value = false;
    pendingDeleteScoreId.value = null;
  }
};

const isOwnProfile = computed(() => {
  return authStore.currentUser?.username === props.username;
});
</script>

<template>
  <LoadingIndicator v-if="isLoading" message="Loading user profile..." />
  <p v-else-if="userNotFound">User not found, redirecting to home page...</p>
  <template v-else>
    <h1>{{ formattedUsername }}'s Profile</h1>
    <hr />
    <UserScores
      :userScores="userScores"
      :canDelete="isOwnProfile"
      @select="handleScoreClick"
      @delete="handleDeleteScore"
    />
    <dialog :open="pendingDeleteScoreId !== null">
      <article>
        <header>
          <h2>Confirm Score Deletion</h2>
        </header>
        <p>
          Are you sure you want to delete this score? This action cannot be
          undone.
        </p>
        <LoadingIndicator
          v-if="isDeletingScore"
          inline
          message="Deleting score..."
        />
        <footer>
          <button
            class="secondary"
            @click="cancelDeleteScore"
            :disabled="isDeletingScore"
          >
            Cancel
          </button>
          <button @click="confirmDeleteScore" :disabled="isDeletingScore">
            Confirm
          </button>
        </footer>
      </article>
    </dialog>
  </template>
</template>
