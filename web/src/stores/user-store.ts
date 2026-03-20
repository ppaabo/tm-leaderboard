import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "@/stores/auth-store";

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
  return { deleteOwnAccount };
});
