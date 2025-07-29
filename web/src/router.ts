import { createWebHistory, createRouter } from "vue-router";

import LeaderboardView from "@/components/leaderboard/LeaderboardView.vue";
import CategoryListView from "@/components/leaderboard/CategoryListView.vue";
import HomeView from "@/components/HomeView.vue";
import LoginView from "@/components/user/LoginView.vue";
import SignUpView from "@/components/user/SignUpView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
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
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
