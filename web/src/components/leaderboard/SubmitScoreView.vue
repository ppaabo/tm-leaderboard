<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { useCategoryStore } from "@/stores/category-store";
import { onMounted, ref, computed } from "vue";
const selectedGamemode = ref("");
const selectedMap = ref("");
const inputScore = ref("");
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

onMounted(() => {
  categoryStore.fetchCategories();
});

const scoreLabel = computed(() =>
  selectedGamemode.value === "time-trial"
    ? "Input time (mm:ss:ms)"
    : "Input score"
);
const scorePlaceholder = computed(() =>
  selectedGamemode.value === "time-trial" ? "mm:ss:ms" : "Score"
);
const scoreType = computed(() =>
  selectedGamemode.value === "time-trial" ? "text" : "number"
);

const timeTrialScorePattern = "^\\d{2}:\\d{2}:\\d{2}$";

const handleSubmit = async () => {
  if (!authStore.currentUser) {
    console.error("Not logged in");
    return;
  }
  const newScore = {
    user: authStore.currentUser.id,
    gamemode: selectedGamemode.value,
    map: selectedMap.value,
    score: inputScore.value,
  };
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newScore),
    });
    if (response.ok) {
      const data = (await response.json()).data;
      console.log("Score submitted:", data);
    } else {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Submitting score failed: ${error}`);
  }
};
</script>

<template>
  <article>
    <form @submit.prevent="handleSubmit">
      <fieldset>
        <label>
          Select gamemode
          <select
            name="gamemode"
            aria-label="Select gamemode"
            v-model="selectedGamemode"
            required
          >
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
          <select
            name="map"
            aria-label="Select map"
            v-model="selectedMap"
            required
          >
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
            aria-label="Input score"
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
