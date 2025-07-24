import { createWebHistory, createRouter } from "vue-router";

import LeaderboardView from "@/components/leaderboard/LeaderboardView.vue";
import CategoryListView from "@/components/leaderboard/CategoryListView.vue";
import Home from "@/components/Home.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/leaderboard", name: "gamemodes", component: CategoryListView },
  {
    path: "/leaderboard/:gamemode",
    name: "maps",
    component: CategoryListView,
    props: true,
  },
  {
    path: "/leaderboard/:gamemode/:map",
    name: "leaderboard",
    component: LeaderboardView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
