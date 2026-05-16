<script setup lang="ts">
import CategoryList from "@/components/leaderboard/CategoryList.vue";
import { useCategoryStore } from "@/stores/category-store";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const store = useCategoryStore();
const props = defineProps<{ gamemode?: string }>();
const router = useRouter();

onMounted(() => {
  store.fetchCategories();
});

const isGamemodeRoute = computed(() => !props.gamemode);

const items = computed(() =>
  isGamemodeRoute.value ? store.gamemodes : store.maps,
);

const title = computed(() =>
  isGamemodeRoute.value ? "Select Gamemode" : "Select Map",
);

const handleSelect = (item: { id: string; name: string }) => {
  if (isGamemodeRoute.value) {
    router.push(`/leaderboard/${item.id}`);
  } else {
    router.push(`/leaderboard/${props.gamemode}/${item.id}`);
  }
};
</script>

<template>
  <h3>{{ title }}</h3>
  <CategoryList :items="items" @select="handleSelect" />
</template>
