<script setup lang="ts">
import { useCategoryStore } from "@/stores/category-store";
import { computed, onMounted, ref } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import { formatTimeTrialScore } from "@/utils/score-format";

const props = defineProps<{ gamemode: string; map: string }>();
const leaderboard = ref<LeaderboardEntryDisplay[]>([]);
const store = useCategoryStore();

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
});

const gamemodeObj = computed(() => store.getGamemodeById(props.gamemode));
const mapObj = computed(() => store.getMapById(props.map));
</script>
<template>
  <p><b>Gamemode: </b>{{ gamemodeObj?.name || props.gamemode }}</p>
  <p><b>Map: </b>{{ mapObj?.name || props.map }}</p>
  <table class="striped">
    <thead>
      <tr>
        <th>Username</th>
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in leaderboard" :key="entry._id">
        <td>{{ entry.user.username }}</td>
        <td>{{ entry.score }}</td>
        <td>{{ new Date(entry.timestamp).toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
</template>
