<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import UserScores from "./UserScores.vue";
import { formatTimeTrialScore } from "@/utils/score-format";
import { useScoreStore } from "@/stores/score-store";
import { useCategoryStore } from "@/stores/category-store";

const props = defineProps<{ username: string }>();
const userScores = ref<LeaderboardEntryDisplay[]>([]);
const scoreStore = useScoreStore();
const categoryStore = useCategoryStore();

onMounted(async () => {
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryData[] = await scoreStore.getScoresByUser(
    props.username
  );
  userScores.value = data.map((entry) => ({
    ...entry,
    rawScore: entry.score,
    score:
      entry.gamemode === "time-trial"
        ? formatTimeTrialScore(entry.score)
        : entry.score.toLocaleString("en-US"),
  }));
});

const formattedUsername = computed(() => {
  return userScores.value.length > 0
    ? userScores.value[0].user.username
    : props.username;
});
</script>

<template>
  <div class="user-profile">
    <h1>{{ formattedUsername }}'s Profile</h1>
    <UserScores :userScores="userScores" />
  </div>
</template>
