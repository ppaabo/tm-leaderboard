<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { submitScoreSchema } from "@/types";
import { timeTrialToMs } from "@/utils/score-utils";

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

const validation = reactive<{
  score: boolean | undefined;
  scoreError?: string;
}>({
  score: undefined,
  scoreError: "",
});

const validateCurrentScore = (): number | null => {
  validation.score = false;
  validation.scoreError = "";
  if (!inputScore.value) {
    return null;
  }
  const result = submitScoreSchema.safeParse({
    gamemode: selectedGamemode.value,
    map: selectedMap.value,
    score: inputScore.value,
  });

  if (!result.success) {
    const scoreIssue = result.error.issues.find((issue) =>
      issue.path.includes("score"),
    );
    if (scoreIssue) {
      validation.score = true;
      validation.scoreError = scoreIssue.message;
    }
    return null;
  }
  if (selectedGamemode.value === "time-trial") {
    return timeTrialToMs(inputScore.value);
  }
  return Number(inputScore.value);
};

const handleSubmit = async () => {
  const formattedScore = validateCurrentScore();
  if (validation.score || formattedScore === null) return;
  emit("submit", {
    gamemode: selectedGamemode.value,
    map: selectedMap.value,
    score: formattedScore,
  });
};

watch([inputScore, selectedGamemode, selectedMap], () => {
  validation.score = undefined;
  validation.scoreError = "";
});

watch(selectedGamemode, () => {
  inputScore.value = "";
});

watch(
  () => props.resetFormTrigger,
  () => {
    selectedGamemode.value = "";
    selectedMap.value = "";
    inputScore.value = "";
    hasSubmitted.value = false;
    validation.score = undefined;
    validation.scoreError = "";
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
          {{ validation.scoreError }}
        </small>
      </label>
    </fieldset>
    <button type="submit">Submit</button>
  </form>
</template>
