<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import UserScores from "@/components/user/UserScores.vue";
import { useAuthStore } from "@/stores/auth-store";
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import {
  type LeaderboardEntryDataPlacement,
  type LeaderboardEntryDisplayPlacement,
  DeleteOwnScoreStatus,
} from "@/types";
import { formatTimeTrialScore } from "@/utils/score-utils";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{ username: string }>();

const scoreStore = useScoreStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const router = useRouter();

const userScores = ref<LeaderboardEntryDisplayPlacement[]>([]);
const userNotFound = ref(false);
const isLoading = ref(true);
const isDeletingScore = ref(false);
const pendingDeleteScoreId = ref<string | null>(null);

const isOwnProfile = computed(() => {
  return authStore.currentUser?.username === props.username;
});

const formattedUsername = computed(() => {
  return userScores.value.length > 0
    ? userScores.value[0].user.username
    : props.username;
});

const fetchUserScores = async () => {
  isLoading.value = true;
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryDataPlacement[] | null =
    await scoreStore.getScoresByUser(props.username);

  if (data === null) {
    userNotFound.value = true;
    isLoading.value = false;
    router.push("/");
    return;
  }
  userScores.value = data.map((entry) => ({
    ...entry,
    rawScore: entry.score,
    score:
      entry.gamemode === "time-trial"
        ? formatTimeTrialScore(entry.score)
        : entry.score.toLocaleString("en-US"),
  }));
  userNotFound.value = false;
  isLoading.value = false;
};

const handleScoreClick = (item: { gamemode: string; map: string }) => {
  router.push({
    name: "leaderboard",
    params: {
      gamemode: item.gamemode,
      map: item.map,
    },
  });
};

const handleDeleteScore = (scoreId: string) => {
  pendingDeleteScoreId.value = scoreId;
};

const cancelDeleteScore = () => {
  pendingDeleteScoreId.value = null;
};

const confirmDeleteScore = async () => {
  const scoreId = pendingDeleteScoreId.value;
  if (!scoreId) return;
  isDeletingScore.value = true;
  try {
    const result = await scoreStore.deleteOwnScore(scoreId);
    if (
      result === DeleteOwnScoreStatus.Deleted ||
      result === DeleteOwnScoreStatus.NotFound
    )
      await fetchUserScores();
  } finally {
    isDeletingScore.value = false;
    pendingDeleteScoreId.value = null;
  }
};

watch(() => props.username, fetchUserScores, { immediate: true });
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
    <ConfirmDialog
      :open="pendingDeleteScoreId !== null"
      title="Confirm Score Deletion"
      message="Are you sure you want to delete this score? This action cannot be undone."
      :loading="isDeletingScore"
      loadingMessage="Deleting score..."
      @cancel="cancelDeleteScore"
      @confirm="confirmDeleteScore"
    />
  </template>
</template>
