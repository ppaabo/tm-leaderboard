import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/components/HomeView.vue";
import CategoryListView from "@/components/leaderboard/CategoryListView.vue";
import LeaderboardView from "@/components/leaderboard/LeaderboardView.vue";
import LoginView from "@/components/user/LoginView.vue";
import SignUpView from "@/components/user/SignUpView.vue";
import SubmitScoreView from "@/components/leaderboard/SubmitScoreView.vue";
import UserProfileView from "@/components/user/UserProfileView.vue";
import UserSettingsView from "@/components/user/UserSettingsView.vue";
import UserList from "@/components/admin/UserList.vue";

import { useAuthStore } from "@/stores/auth-store";

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
  { path: "/submit", name: "submit", component: SubmitScoreView },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
    meta: { requiresGuest: true },
  },
  {
    path: "/user/:username",
    name: "user",
    component: UserProfileView,
    props: true,
  },
  {
    path: "/settings",
    name: "settings",
    component: UserSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "users",
    component: UserList,
    meta: { requiresAuth: true, requiresRole: ["admin"] },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.refreshSession();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: "home" };
  }

  const requiredRoles = to.meta!.requiresRole as string[];

  if (requiredRoles && authStore.currentUser) {
    const userRole = authStore.currentUser.accountType;
    if (!userRole || !requiredRoles.includes(userRole)) {
      return { name: "home" };
    }
  }
});

export default router;
