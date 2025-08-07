<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import { onMounted, ref, computed, reactive, watch } from "vue";
import { parseTimeTrialScore } from "@/utils/score-format";
import type { ScorePayload, ScoreValidationState } from "@/types";

const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const scoreStore = useScoreStore();
const selectedGamemode = ref("");
const selectedMap = ref("");
const inputScore = ref("");
const hasSubmitted = ref(false);

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

const validation = reactive<ScoreValidationState>({
  score: undefined,
});
const validateScore = (): number | null => {
  const input = inputScore.value;
  if (!input) {
    validation.score = true;
    return null;
  }
  if (scoreType.value === "text") {
    const value = inputScore.value.trim();
    const timeTrialRegex = /^\d{1,2}:\d{2}\.\d{2}$/;
    if (!timeTrialRegex.test(value)) {
      validation.score = true;
      return null;
    }
    try {
      const parsed = parseTimeTrialScore(value);
      validation.score = false;
      return parsed;
    } catch (error) {
      validation.score = true;
      return null;
    }
  } else {
    const num = Number(input);
    if (isNaN(num) || num < 0) {
      validation.score = true;
      return null;
    }
    validation.score = false;
    return num;
  }
};

const handleSubmit = async () => {
  hasSubmitted.value = true;
  const formattedScore = validateScore();
  if (validation.score || formattedScore === null) return;
  if (!authStore.currentUser) {
    console.error("Not logged in");
    return;
  }
  const newScore: ScorePayload = {
    user: authStore.currentUser.id,
    gamemode: selectedGamemode.value,
    map: selectedMap.value,
    score: formattedScore,
  };
  scoreStore.submitScore(newScore);
};

watch(inputScore, () => {
  if (hasSubmitted.value) validateScore();
});

watch(selectedGamemode, () => {
  inputScore.value = "";
  validation.score = undefined;
  hasSubmitted.value = false;
});
</script>

<template>
  <article v-if="authStore.currentUser">
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
            :key="scoreType"
            :type="scoreType"
            name="score"
            :placeholder="scorePlaceholder"
            v-model="inputScore"
            required
            :aria-invalid="validation.score"
            aria-describedby="score-helper"
          />
          <small v-if="validation.score" id="score-helper">
            {{
              scoreType === "text"
                ? "Format must be mm.ss.ms (e.g. 01:30.50)"
                : "Score must be a valid number"
            }}
          </small>
        </label>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  </article>
  <p v-else>You must be logged in to submit scores!</p>
</template>

<style scoped></style>
