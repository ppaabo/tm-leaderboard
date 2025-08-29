<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { useCategoryStore } from "@/stores/category-store";
import { useScoreStore } from "@/stores/score-store";
import { onMounted, ref } from "vue";
import type { ScorePayload } from "shared";
import SubmitScoreForm from "./SubmitScoreForm.vue";

const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const scoreStore = useScoreStore();
const resetFormTrigger = ref(0);

onMounted(async () => {
  await categoryStore.fetchCategories();
});

const handleFormSubmit = async (payload: {
  gamemode: string;
  map: string;
  score: number;
}) => {
  if (!authStore.currentUser) return;
  const newScore: ScorePayload = {
    gamemode: payload.gamemode,
    map: payload.map,
    score: payload.score,
  };
  await scoreStore.submitScore(newScore);
  resetFormTrigger.value++; // Reset form
};
</script>

<template>
  <article v-if="authStore.currentUser">
    <SubmitScoreForm
      :gamemodes="categoryStore.gamemodes"
      :maps="categoryStore.maps"
      :resetFormTrigger="resetFormTrigger"
      @submit="handleFormSubmit"
    />
  </article>
  <p v-else>You must be logged in to submit scores!</p>
</template>

<style scoped></style>
