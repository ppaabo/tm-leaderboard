<script setup lang="ts">
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import { computed, onMounted, ref } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import { formatTimeTrialScore } from "@/utils/score-format";
import LoadingIndicator from "../LoadingIndicator.vue";
import { useRouter } from "vue-router";

const categoryStore = useCategoryStore();
const scoreStore = useScoreStore();
const router = useRouter();
const props = defineProps<{ gamemode: string; map: string }>();
const leaderboard = ref<LeaderboardEntryDisplay[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

onMounted(async () => {
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryData[] | null = await scoreStore.getLeaderboard(
    props.gamemode,
    props.map
  );

  if (data === null) {
    hasError.value = true;
    setTimeout(() => {
      router.push("/leaderboard");
    }, 3000);
  } else {
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
  isLoading.value = false;
});

const gamemodeObj = computed(() =>
  categoryStore.getGamemodeById(props.gamemode)
);
const mapObj = computed(() => categoryStore.getMapById(props.map));

const getPlacementText = (index: number): string => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return (index + 1).toString();
};

const handleClick = (username: string) => {
  router.push({ name: "user", params: { username } });
};
</script>

<template>
  <template v-if="hasError">
    <p>Invalid gamemode or map. Redirecting...</p>
  </template>
  <template v-else>
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
      <tbody v-else-if="leaderboard.length === 0">
        <tr>
          <td colspan="4" class="empty-message">
            No scores have been submitted for this gamemode and map yet. Be the
            first to submit a score!
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="(entry, index) in leaderboard"
          :key="entry._id"
          @click="handleClick(entry.user.username)"
          class="clickable-row"
          :title="`View ${entry.user.username}'s profile`"
        >
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
</template>
<style scoped>
.placement {
  font-weight: 600;
}
.loading-cell {
  text-align: center;
  padding: 2rem 0;
}
.empty-message {
  text-align: center;
  font-style: italic;
}
.clickable-row {
  cursor: pointer;
}
</style>
