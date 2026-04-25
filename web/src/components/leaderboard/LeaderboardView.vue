<script setup lang="ts">
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import type { LeaderboardEntryData, LeaderboardEntryDisplay } from "@/types";
import { formatTimeTrialScore } from "@/utils/score-utils";
import LeaderboardTable from "./LeaderboardTable.vue";
import LoadingIndicator from "../LoadingIndicator.vue";

const categoryStore = useCategoryStore();
const scoreStore = useScoreStore();
const router = useRouter();
const props = defineProps<{ gamemode: string; map: string }>();
const leaderboard = ref<LeaderboardEntryDisplay[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  await categoryStore.fetchCategories();
  const data: LeaderboardEntryData[] | null = await scoreStore.getLeaderboard(
    props.gamemode,
    props.map,
  );
  if (data === null) {
    router.push("/leaderboard");
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
    isLoading.value = false;
  }
});

const gamemodeObj = computed(() =>
  categoryStore.getGamemodeById(props.gamemode),
);
const mapObj = computed(() => categoryStore.getMapById(props.map));

const handleClick = (username: string) => {
  router.push({ name: "user", params: { username } });
};
</script>

<template>
  <template v-if="isLoading">
    <LoadingIndicator message="Loading leaderboard..." />
  </template>
  <template v-else>
    <section>
      <header>
        <p>
          <strong>Gamemode:</strong> {{ gamemodeObj?.name || props.gamemode }}
        </p>
        <p><strong>Map:</strong> {{ mapObj?.name || props.map }}</p>
      </header>
    </section>
    <template v-if="leaderboard.length === 0">
      <p class="empty-message">
        No scores have been submitted for this gamemode and map yet. Be the
        first to submit a score!
      </p>
    </template>
    <template v-else>
      <LeaderboardTable :leaderboard="leaderboard" @rowClick="handleClick" />
    </template>
  </template>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 2px solid var(--pico-secondary-background);
}
.empty-message {
  text-align: center;
  font-style: italic;
}
</style>
