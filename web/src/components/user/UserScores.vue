<script setup lang="ts">
import { useCategoryStore } from "@/stores/category-store";
import type { LeaderboardEntryDisplayPlacement } from "@/types";
import { computed } from "vue";

const categoryStore = useCategoryStore();
const props = defineProps<{
  userScores: LeaderboardEntryDisplayPlacement[];
  canDelete: boolean;
}>();

defineEmits<{
  (e: "select", item: { gamemode: string; map: string }): void;
  (e: "delete", scoreId: string): void;
}>();

const scoresByGamemode = computed(() => {
  const groups: Record<string, LeaderboardEntryDisplayPlacement[]> = {};
  // Group by gamemode
  props.userScores.forEach((score) => {
    if (!groups[score.gamemode]) {
      groups[score.gamemode] = [];
    }
    groups[score.gamemode].push(score);
  });
  // Sort by map name
  Object.keys(groups).forEach((gamemode) => {
    groups[gamemode].sort((a, b) => {
      const mapNameA = getMapName(a.map).toLowerCase();
      const mapNameB = getMapName(b.map).toLowerCase();
      return mapNameA.localeCompare(mapNameB);
    });
  });
  return groups;
});

const getGamemodeName = (id: string) =>
  categoryStore.getGamemodeById(id)?.name || id;
const getMapName = (id: string) => categoryStore.getMapById(id)?.name || id;

const getPlacementText = (placement: number): string => {
  if (placement === 1) return "🥇";
  if (placement === 2) return "🥈";
  if (placement === 3) return "🥉";
  return placement.toString();
};
</script>

<template>
  <p v-if="userScores.length === 0">No scores found for the user</p>
  <section
    v-else
    v-for="(scores, gamemode) in scoresByGamemode"
    :key="gamemode"
    class="gamemode-section"
  >
    <h3>{{ getGamemodeName(gamemode) }}</h3>
    <table class="striped">
      <thead>
        <tr>
          <th>Placement</th>
          <th>Map</th>
          <th>Score</th>
          <th>Date</th>
          <th v-if="canDelete">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in scores"
          :key="entry._id"
          @click="$emit('select', { gamemode: entry.gamemode, map: entry.map })"
          class="clickable-row"
          :title="`View leaderboard for: ${getGamemodeName(
            entry.gamemode,
          )} on ${getMapName(entry.map)}`"
        >
          <td>{{ getPlacementText(entry.placement) }}</td>
          <td>{{ getMapName(entry.map) }}</td>
          <td>{{ entry.score }}</td>
          <td>{{ new Date(entry.timestamp).toLocaleString() }}</td>
          <td v-if="canDelete">
            <button class="delete-btn" @click.stop="$emit('delete', entry._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.gamemode-section {
  margin-bottom: 2rem;
}
.clickable-row {
  cursor: pointer;
}
</style>
