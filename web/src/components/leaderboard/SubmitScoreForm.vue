<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { validateScore } from "@/utils/score-utils";
import type { ScoreValidationState } from "@/types";

const props = defineProps<{
  gamemodes: any[];
  maps: any[];
  resetFormTrigger: number;
}>();

const emit = defineEmits<{
  (
    e: "submit",
    payload: { gamemode: string; map: string; score: number },
  ): void;
}>();

const selectedGamemode = ref("");
const selectedMap = ref("");
const inputScore = ref("");
const hasSubmitted = ref(false);

const scoreLabel = computed(() =>
  selectedGamemode.value === "time-trial"
    ? "Input time (mm:ss:ms)"
    : "Input score",
);
const scorePlaceholder = computed(() =>
  selectedGamemode.value === "time-trial" ? "mm:ss.ms" : "Score",
);
const scoreType = computed(() =>
  selectedGamemode.value === "time-trial" ? "text" : "number",
);
const validation = reactive<ScoreValidationState>({
  score: undefined,
});

const validateCurrentScore = (): number | null => {
  const result = validateScore(
    inputScore.value,
    scoreType.value as "text" | "number",
  );
  validation.score = !result.isValid;
  return result.value;
};

const handleSubmit = async () => {
  hasSubmitted.value = true;
  const formattedScore = validateCurrentScore();
  if (validation.score || formattedScore === null) return;
  emit("submit", {
    gamemode: selectedGamemode.value,
    map: selectedMap.value,
    score: formattedScore,
  });
};

watch(inputScore, () => {
  if (hasSubmitted.value) validateCurrentScore();
});

watch(selectedGamemode, () => {
  inputScore.value = "";
  validation.score = undefined;
  hasSubmitted.value = false;
});

watch(
  () => props.resetFormTrigger,
  () => {
    selectedGamemode.value = "";
    selectedMap.value = "";
    inputScore.value = "";
    hasSubmitted.value = false;
    validation.score = undefined;
  },
);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <fieldset>
      <label>
        Select gamemode
        <select name="gamemode" v-model="selectedGamemode" required>
          <option disabled value="">Please select</option>
          <option v-for="mode in gamemodes" :key="mode.id" :value="mode.id">
            {{ mode.name }}
          </option>
        </select>
      </label>
      <label>
        Select map
        <select name="map" v-model="selectedMap" required>
          <option disabled value="">Please select</option>
          <option v-for="map in maps" :key="map.id" :value="map.id">
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
</template>
