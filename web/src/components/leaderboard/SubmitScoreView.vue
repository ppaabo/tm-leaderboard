<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import { onMounted, ref, computed } from "vue";
import { parseTimeTrialScore } from "@/utils/score-format";
import type { ScorePayload } from "@/types";

const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const scoreStore = useScoreStore();
const selectedGamemode = ref("");
const selectedMap = ref("");
const inputScore = ref("");

onMounted(() => {
  categoryStore.fetchCategories();
});

const scoreLabel = computed(() =>
  selectedGamemode.value === "time-trial"
    ? "Input time (mm:ss:ms)"
    : "Input score"
);
const scorePlaceholder = computed(() =>
  selectedGamemode.value === "time-trial" ? "mm:ss.ms" : "Score"
);
const scoreType = computed(() =>
  selectedGamemode.value === "time-trial" ? "text" : "number"
);

const timeTrialScorePattern = "\\d{1,2}:\\d{2}\\.\\d{2}";

const handleSubmit = async () => {
  if (!authStore.currentUser) {
    console.error("Not logged in");
    return;
  }
  let formattedScore: number = 0;
  try {
    if (scoreType.value === "text") {
      formattedScore = parseTimeTrialScore(inputScore.value);
    } else formattedScore = Number(inputScore.value);
  } catch (error) {
    console.error("Parsing score failed: ", error);
  }
  const newScore: ScorePayload = {
    user: authStore.currentUser.id,
    gamemode: selectedGamemode.value,
    map: selectedMap.value,
    score: formattedScore,
  };
  scoreStore.submitScore(newScore);
};
</script>

<template>
  <article>
    <form @submit.prevent="handleSubmit">
      <fieldset>
        <label>
          Select gamemode
          <select name="gamemode" v-model="selectedGamemode" required>
            <option disabled value="">Please select</option>
            <option
              v-for="mode in categoryStore.gamemodes"
              :key="mode.id"
              :value="mode.id"
            >
              {{ mode.name }}
            </option>
          </select>
        </label>
        <label>
          Select map
          <select name="map" v-model="selectedMap" required>
            <option disabled value="">Please select</option>
            <option
              v-for="map in categoryStore.maps"
              :key="map.id"
              :value="map.id"
            >
              {{ map.name }}
            </option>
          </select>
        </label>
        <label v-if="selectedGamemode">
          {{ scoreLabel }}
          <input
            :type="scoreType"
            name="score"
            :placeholder="scorePlaceholder"
            v-model="inputScore"
            :pattern="scoreType === 'text' ? timeTrialScorePattern : undefined"
            required
          />
        </label>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  </article>
</template>

<style scoped></style>
