import { defineStore } from "pinia";
import { ref } from "vue";
import type { AuthUser, RegisterPayload, LoginPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<AuthUser | null>(null);

  async function loginUser(userObj: LoginPayload) {
    console.log(userObj);
  }

  async function createUser(userObj: RegisterPayload) {
    console.log(userObj);
  }
  return { currentUser, loginUser, createUser };
});
