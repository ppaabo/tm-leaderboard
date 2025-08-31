<script setup lang="ts">
import type { LeaderboardEntryDisplay } from "@/types";
defineProps<{
  leaderboard: LeaderboardEntryDisplay[];
}>();
defineEmits<{
  (e: "rowClick", username: string): void;
}>();

const getPlacementText = (index: number): string => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return (index + 1).toString();
};
</script>

<template>
  <table class="striped">
    <thead>
      <tr>
        <th>Placement</th>
        <th>Username</th>
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(entry, index) in leaderboard"
        :key="entry._id"
        @click="$emit('rowClick', entry.user.username)"
        class="clickable-row"
        :title="`View ${entry.user.username}'s profile`"
      >
        <td class="placement">
          {{ getPlacementText(index) }}
        </td>
        <td>{{ entry.user.username }}</td>
        <td>{{ entry.score }}</td>
        <td>{{ new Date(entry.timestamp).toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.clickable-row {
  cursor: pointer;
}
</style>
