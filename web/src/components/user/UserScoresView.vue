<script setup lang="ts">
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import { formatTimeTrialScore } from "@/utils/score-format";
import { ref, onMounted, computed } from "vue";

const props = defineProps<{ username: string }>();
const userScores = ref<LeaderboardEntryDisplay[]>([]);
const categoryStore = useCategoryStore();
const scoreStore = useScoreStore();

const scoresByGamemode = computed(() => {
  const groups: Record<string, LeaderboardEntryDisplay[]> = {};
  // Group by gamemode
  userScores.value.forEach((score) => {
    if (!groups[score.gamemode]) {
      groups[score.gamemode] = [];
    }
    groups[score.gamemode].push(score);
  });
  // Sort by map name
  Object.keys(groups).forEach((gamemode) => {
    groups[gamemode].sort((a, b) => {
      const mapNameA = getMapName(a.map).toLowerCase();
      const mapNameB = getMapName(b.map).toLowerCase();
      return mapNameA.localeCompare(mapNameB);
    });
  });
  return groups;
});

onMounted(async () => {
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryData[] = await scoreStore.getScoresByUser(
    props.username
  );
  if (data) {
    userScores.value = data.map((entry) => ({
      ...entry,
      rawScore: entry.score,
      score:
        entry.gamemode === "time-trial"
          ? formatTimeTrialScore(entry.score)
          : entry.score.toLocaleString("en-US"),
    }));
  }
});

const getGamemodeName = (id: string) =>
  categoryStore.getGamemodeById(id)?.name || id;
const getMapName = (id: string) => categoryStore.getMapById(id)?.name || id;
</script>
<template>
  <p v-if="userScores.length === 0">No scores found for the user</p>
  <div
    v-else
    v-for="(scores, gamemode) in scoresByGamemode"
    :key="gamemode"
    class="gamemode-section"
  >
    <h3>{{ getGamemodeName(gamemode) }}</h3>
    <table class="striped">
      <thead>
        <tr>
          <th>Map</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in scores" :key="entry._id">
          <td>{{ getMapName(entry.map) }}</td>
          <td>{{ entry.score }}</td>
          <td>{{ new Date(entry.timestamp).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.gamemode-section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.25rem;
}
</style>
