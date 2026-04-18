import { defineStore } from "pinia";
import { type LeaderboardEntryData, DeleteOwnScoreStatus } from "@/types";
import type { ScorePayload, SubmitScoreResponse } from "shared";
import { useNotification } from "@kyvg/vue3-notification";
import { useCategoryStore } from "@/stores/category-store";

export const useScoreStore = defineStore("score", () => {
  const { notify } = useNotification();
  const categoryStore = useCategoryStore();

  async function submitScore(scorePayload: ScorePayload) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(scorePayload),
      });

      if (response.ok) {
        const responseJson: SubmitScoreResponse = await response.json();
        submitScoreNotification(responseJson);
        return responseJson.result; // created | updated | ignored
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error("submitScore", error);
      notify({
        type: "error",
        title: "Error",
        text: "Submitting score failed!",
      });
      return "error";
    }
  }

  async function deleteOwnScore(
    scoreId: string,
  ): Promise<DeleteOwnScoreStatus> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/scores/${scoreId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        notify({ type: "success", title: "Score deleted" });
        return DeleteOwnScoreStatus.Deleted;
      }
      if (response.status === 404) {
        notify({ type: "error", title: "Score not found" });
        return DeleteOwnScoreStatus.NotFound;
      }
      if (response.status === 403) {
        notify({ type: "error", title: "Forbidden" });
        return DeleteOwnScoreStatus.Forbidden;
      }
      throw new Error(`Unexpected error. Response status: ${response.status}`);
    } catch (error) {
      console.error("deleteOwnScore", error);
      notify({
        type: "error",
        title: "Unexpected error",
        text: "Deleting score failed",
      });
      return DeleteOwnScoreStatus.Error;
    }
  }

  async function getScoresByUser(
    username: string,
  ): Promise<LeaderboardEntryData[] | null> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/scores/user/${username}`,
      );
      if (response.ok) {
        const data = (await response.json()).data;
        return data;
      }
      if (response.status === 404) {
        notify({
          type: "error",
          title: "User Not Found",
          text: `User "${username}" does not exist`,
        });
        return null;
      }
      throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      console.error("getScoresByUser", error);
      notify({
        type: "error",
        title: "Error",
        text: "Fetching scores failed!",
      });
      return [];
    }
  }

  async function getLeaderboard(
    gamemode: string,
    map: string,
  ): Promise<LeaderboardEntryData[] | null> {
    try {
      const base = `${import.meta.env.VITE_API_URL}/scores`;
      const url = base.startsWith("/") // handle relative url (vite proxy)
        ? new URL(base, window.location.origin)
        : new URL(base);
      url.searchParams.set("gamemode", gamemode);
      url.searchParams.set("map", map);

      const response = await fetch(url);
      if (response.ok) {
        const data: LeaderboardEntryData[] = (await response.json()).data;
        return data;
      }
      if (response.status === 404) {
        notify({
          type: "error",
          title: "Error",
          text: "Given gamemode or map is not valid",
        });
        return null;
      } else throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      console.error("getLeaderboard: ", error);
      notify({
        type: "error",
        title: "Error",
        text: "Fetching leaderboard failed!",
      });
      return null;
    }
  }

  function submitScoreNotification(response: SubmitScoreResponse) {
    const gamemode = categoryStore.getGamemodeById(response.data.gamemode);
    const map = categoryStore.getMapById(response.data.map);
    switch (response.result) {
      case "created":
        notify({
          type: "success",
          title: "Score added",
          text: `Your score for ${gamemode?.name} - ${map?.name} has been added`,
        });
        break;
      case "updated":
        notify({
          type: "success",
          title: "Score updated",
          text: `Your score for ${gamemode?.name} - ${map?.name} has been updated`,
        });
        break;
      case "ignored":
        notify({
          type: "info",
          title: "Score unchanged",
          text: `Your previous score for ${gamemode?.name} - ${map?.name} is better, so it wasn't updated`,
        });
        break;
    }
  }

  return { submitScore, getScoresByUser, getLeaderboard, deleteOwnScore };
});
