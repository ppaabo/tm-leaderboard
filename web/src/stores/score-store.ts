import { defineStore } from "pinia";
import type { ScorePayload, LeaderboardEntryData } from "@/types";
import { useNotification } from "@kyvg/vue3-notification";

export const useScoreStore = defineStore("score", () => {
  const { notify } = useNotification();
  async function submitScore(scorePayload: ScorePayload) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scorePayload),
      });
      if (response.ok) {
        const data = (await response.json()).data;
        console.log("Score submitted:", data);
        notify({
          type: "success",
          title: "Success",
          text: "Score submitted succesfully!",
        });
        return data;
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
    }
  }

  async function getScoresByUser(
    username: string
  ): Promise<LeaderboardEntryData[] | null> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/scores/user/${username}`
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
    map: string
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

  return { submitScore, getScoresByUser, getLeaderboard };
});
