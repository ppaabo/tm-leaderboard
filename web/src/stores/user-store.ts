import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "@/stores/auth-store";
import type { UserList } from "shared";
import { DeleteUserAccountStatus } from "@/types";

export const useUserStore = defineStore("user", () => {
  const { notify } = useNotification();
  const authStore = useAuthStore();
  async function deleteOwnAccount(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Account deleted");
        notify({
          type: "success",
          text: "Your account has been deleted",
        });
        authStore.clearUser();
        return true;
      } else throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      console.error("deleteOwnAccount", error);
      notify({
        type: "error",
        text: "Deleting account failed. Please try again",
      });
      return false;
    }
  }

  async function deleteUserAccount(
    userId: string,
  ): Promise<DeleteUserAccountStatus> {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        notify({ type: "success", title: "User Deleted" });
        return DeleteUserAccountStatus.Deleted;
      }
      if (response.status === 403) {
        notify({ type: "error", title: "Forbidden" });
        return DeleteUserAccountStatus.Forbidden;
      }
      if (response.status === 404) {
        notify({ type: "error", title: "User not found" });
        return DeleteUserAccountStatus.NotFound;
      }
      throw new Error(`Unexpected error. Response status: ${response.status}`);
    } catch (error) {
      console.error("deleteUserAccount", error);
      notify({
        type: "error",
        title: "Deleting user failed",
      });
      return DeleteUserAccountStatus.Error;
    }
  }

  async function getAllUsers(): Promise<UserList | null> {
    try {
      const url = `${import.meta.env.VITE_API_URL}/users`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data: UserList = (await response.json()).data;
      return data;
    } catch (error) {
      console.error("getAllusers: ", error);
      notify({
        type: "error",
        title: "Error",
        text: "Fetching users failed!",
      });
      return null;
    }
  }
  return {
    deleteOwnAccount,
    getAllUsers,
    deleteUserAccount,
  };
});
