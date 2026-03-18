<script setup lang="ts">
import { watch, ref, computed } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import UserScores from "./UserScores.vue";
import { formatTimeTrialScore } from "@/utils/score-format";
import { useScoreStore } from "@/stores/score-store";
import { useCategoryStore } from "@/stores/category-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "vue-router";
import LoadingIndicator from "../LoadingIndicator.vue";

const props = defineProps<{ username: string }>();
const userScores = ref<LeaderboardEntryDisplay[]>([]);
const userNotFound = ref(false);
const isLoading = ref(true);
const scoreStore = useScoreStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

watch(
  () => props.username,
  async () => {
    isLoading.value = true;
    await categoryStore.fetchCategories();
    const data: LeaderboardEntryData[] | null =
      await scoreStore.getScoresByUser(props.username);
    if (data === null) {
      userNotFound.value = true;
      setTimeout(() => {
        router.push("/");
      }, 3000);
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
  },
  { immediate: true },
);

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

const handleDeleteClick = async () => {
  const success = await userStore.deleteOwnAccount();
  if (success) {
    setTimeout(() => {
      router.push({ name: "home" });
    }, 2000);
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
    <UserScores :userScores="userScores" @select="handleScoreClick" />
    <template v-if="isOwnProfile">
      <h1>Account settings</h1>
      <button @click="handleDeleteClick">Delete Account</button>
    </template>
  </template>
</template>
