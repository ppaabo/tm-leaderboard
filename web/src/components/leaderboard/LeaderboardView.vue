<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import { computed, onMounted } from "vue";
const props = defineProps<{ gamemode: string; map: string }>();
const store = useCategoryStore();
onMounted(() => {
  store.fetchCategories();
});
const gamemodeObj = computed(() => store.getGamemodeById(props.gamemode));
const mapObj = computed(() => store.getMapById(props.map));
</script>
<template>
  <h2>Leaderboard view for:</h2>
  <p>Gamemode: {{ gamemodeObj?.name || props.gamemode }}</p>
  <p>Map: {{ mapObj?.name || props.map }}</p>
</template>
