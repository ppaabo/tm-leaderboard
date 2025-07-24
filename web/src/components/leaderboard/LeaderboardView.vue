<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import { computed, onMounted, ref } from "vue";
interface LeaderboardUser {
  _id: string;
  username: string;
}
interface LeaderboardEntry {
  _id: string;
  user: LeaderboardUser;
  gamemode: string;
  map: string;
  score: number;
  timestamp: string;
}
const props = defineProps<{ gamemode: string; map: string }>();
const leaderboard = ref<LeaderboardEntry[]>([]);
const store = useCategoryStore();

onMounted(async () => {
  store.fetchCategories();
  const response = await fetch(`/api/scores/${props.gamemode}/${props.map}`);
  if (response.ok) {
    leaderboard.value = (await response.json()).data;
  }
});

const gamemodeObj = computed(() => store.getGamemodeById(props.gamemode));
const mapObj = computed(() => store.getMapById(props.map));
</script>
<template>
  <p><b>Gamemode: </b>{{ gamemodeObj?.name || props.gamemode }}</p>
  <p><b>Map: </b>{{ mapObj?.name || props.map }}</p>
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in leaderboard" :key="entry._id">
        <td>{{ entry.user.username }}</td>
        <td>{{ entry.score }}</td>
        <td>{{ new Date(entry.timestamp).toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
</template>
