<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import CategoryList from "@/components/leaderboard/CategoryList.vue";

const store = useCategoryStore();
const props = defineProps<{ gamemode?: string }>();
const router = useRouter();

onMounted(() => {
  store.fetchCategories();
});

const isGamemodeRoute = computed(() => !props.gamemode);
const items = computed(() =>
  isGamemodeRoute.value ? store.gamemodes : store.maps
);

const title = computed(() =>
  isGamemodeRoute.value ? "Select Gamemode" : "Select Map"
);

function handleSelect(item: { id: string; name: string }) {
  if (isGamemodeRoute.value) {
    router.push(`/leaderboard/${item.id}`);
  } else {
    router.push(`/leaderboard/${props.gamemode}/${item.id}`);
  }
}
</script>

<template>
  <CategoryList :items="items" :title="title" @select="handleSelect" />
</template>
