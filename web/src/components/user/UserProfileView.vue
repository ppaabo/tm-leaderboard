<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import UserScores from "./UserScores.vue";
import { formatTimeTrialScore } from "@/utils/score-format";
import { useScoreStore } from "@/stores/score-store";
import { useCategoryStore } from "@/stores/category-store";
import { useRouter } from "vue-router";
import LoadingIndicator from "../LoadingIndicator.vue";

const props = defineProps<{ username: string }>();
const userScores = ref<LeaderboardEntryDisplay[]>([]);
const userNotFound = ref(false);
const isLoading = ref(true);
const scoreStore = useScoreStore();
const categoryStore = useCategoryStore();
const router = useRouter();

onMounted(async () => {
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryData[] | null = await scoreStore.getScoresByUser(
    props.username
  );
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
  }
  isLoading.value = false;
});

const formattedUsername = computed(() => {
  return userScores.value.length > 0
    ? userScores.value[0].user.username
    : props.username;
});
</script>

<template>
  <LoadingIndicator v-if="isLoading" message="Loading user profile..." />
  <p v-else-if="userNotFound">User not found, redirecting to home page...</p>
  <template v-else>
    <h1>{{ formattedUsername }}'s Profile</h1>
    <hr />
    <UserScores :userScores="userScores" />
  </template>
</template>
