import { defineStore } from "pinia";
import { ref } from "vue";
import type { AuthUser, RegisterPayload, LoginPayload } from "shared";
import { useNotification } from "@kyvg/vue3-notification";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<AuthUser | null>(null);
  const { notify } = useNotification();

  async function loginUser(userObj: LoginPayload): Promise<boolean> {
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
        },
      );
      if (response.ok) {
        const data: AuthUser = (await response.json()).data;
        currentUser.value = data;
        console.log("Login succesful: ", data);
        notify({
          type: "success",
          title: "Success",
          text: `Welcome back, ${data.username}!`,
        });
        return true;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error("loginUser", error);
      notify({
        type: "error",
        title: "Login Failed",
        text: "Invalid username or password. Please try again.",
      });
      return false;
    }
  }

  async function signUpUser(userObj: RegisterPayload): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObj),
        },
      );
      if (response.ok) {
        const data: AuthUser = (await response.json()).data;
        currentUser.value = data;
        console.log("Signup succesful: ", data);
        notify({
          type: "success",
          title: "Account Created",
          text: `Welcome, ${data.username}!`,
        });
        return true;
      } else throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      console.error("signUpUser", error);
      notify({
        type: "error",
        title: "Registration Failed",
        text: "Could not create account. The username or email may already be taken.",
      });
      return false;
    }
  }

  async function logoutUser() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (response.ok) {
        currentUser.value = null;
        console.log("Logged out");
        notify({
          type: "info",
          text: "You have been logged out",
        });
      } else throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      console.error("logoutUser", error);
      notify({
        type: "error",
        text: "Logout failed. Please try again.",
      });
    }
  }

  async function refreshSession() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data: AuthUser = (await response.json()).data;
        currentUser.value = data;
      } else {
        currentUser.value = null;
        console.log("Not logged in");
      }
    } catch (error) {
      currentUser.value = null;
      console.error("getMe", error);
    }
  }

  return { currentUser, loginUser, signUpUser, refreshSession, logoutUser };
});
