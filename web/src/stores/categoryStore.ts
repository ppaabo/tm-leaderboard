import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const gamemodes = ref<{ id: string; name: string }[]>([]);
  const maps = ref<{ id: string; name: string }[]>([]);

  async function fetchCategories() {
    const response = await fetch("/api/categories");
    if (response.ok) {
      const data = (await response.json()).data;
      gamemodes.value = data.gamemodes;
      maps.value = data.maps;
    }
  }
  function getGamemodeById(id: string) {
    return gamemodes.value.find((g) => g.id === id);
  }
  function getMapById(id: string) {
    return maps.value.find((m) => m.id === id);
  }

  return { gamemodes, maps, fetchCategories, getGamemodeById, getMapById };
});
