import { defineStore } from "pinia";
import { ref } from "vue";
import type { AuthUser, RegisterPayload, LoginPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<AuthUser | null>(null);

  async function loginUser(userObj: LoginPayload) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObj),
        }
      );
      if (response.ok) {
        const data: AuthUser = (await response.json()).data;
        currentUser.value = data;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error("loginUser", error);
    }
  }

  async function createUser(userObj: RegisterPayload) {
    console.log(userObj);
  }
  return { currentUser, loginUser, createUser };
});
