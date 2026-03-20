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
  if (!authStore.isAuthenticated) return;
  const newScore: ScorePayload = {
    gamemode: payload.gamemode,
    map: payload.map,
    score: payload.score,
  };
  let result = await scoreStore.submitScore(newScore);
  if (result === "created" || result === "updated") resetFormTrigger.value++; // Reset form
};
</script>

<template>
  <article v-if="authStore.isAuthenticated">
    <SubmitScoreForm
      :gamemodes="categoryStore.gamemodes"
      :maps="categoryStore.maps"
      :resetFormTrigger="resetFormTrigger"
      @submit="handleFormSubmit"
    />
  </article>
  <template v-else>
    <p>
      You need to be logged in to submit scores.
      <router-link :to="{ name: 'login' }">Log in</router-link>
    </p>

    <p>
      Don't have an account?
      <router-link :to="{ name: 'signup' }">Create a new account</router-link>
    </p>
  </template>
</template>

<style scoped></style>
