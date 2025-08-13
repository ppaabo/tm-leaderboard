<script setup lang="ts">
import { useCategoryStore } from "@/stores/category-store";
import { computed, onMounted, ref } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import { formatTimeTrialScore } from "@/utils/score-format";
import LoadingIndicator from "../LoadingIndicator.vue";

const props = defineProps<{ gamemode: string; map: string }>();
const leaderboard = ref<LeaderboardEntryDisplay[]>([]);
const store = useCategoryStore();
const isLoading = ref(true);

onMounted(async () => {
  store.fetchCategories();
  const response = await fetch(`/api/scores/${props.gamemode}/${props.map}`);
  if (response.ok) {
    const data: LeaderboardEntryData[] = (await response.json()).data;
    if (props.gamemode === "time-trial") {
      leaderboard.value = data.map((entry) => ({
        ...entry,
        rawScore: entry.score,
        score: formatTimeTrialScore(entry.score),
      }));
    } else {
      leaderboard.value = data.map((entry) => ({
        ...entry,
        rawScore: entry.score,
        score: entry.score.toLocaleString("en-US"),
      }));
    }
  }
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});

const gamemodeObj = computed(() => store.getGamemodeById(props.gamemode));
const mapObj = computed(() => store.getMapById(props.map));

const getPlacementText = (index: number): string => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return (index + 1).toString();
};
</script>
<template>
  <p><b>Gamemode: </b>{{ gamemodeObj?.name || props.gamemode }}</p>
  <p><b>Map: </b>{{ mapObj?.name || props.map }}</p>
  <table class="striped">
    <thead>
      <tr>
        <th>Placement</th>
        <th>Username</th>
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody v-if="isLoading">
      <tr>
        <td colspan="4" class="loading-cell">
          <LoadingIndicator inline message="Loading data..." />
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="(entry, index) in leaderboard" :key="entry._id">
        <td class="placement">
          {{ getPlacementText(index) }}
        </td>
        <td>{{ entry.user.username }}</td>
        <td>{{ entry.score }}</td>
        <td>{{ new Date(entry.timestamp).toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
.placement {
  font-weight: 600;
}
.loading-cell {
  text-align: center;
  padding: 2rem 0;
}
</style>
