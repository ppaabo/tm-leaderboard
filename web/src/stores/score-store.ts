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
  ): Promise<LeaderboardEntryData[]> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/scores/${username}`
      );
      if (response.ok) {
        const data = (await response.json()).data;
        return data;
      } else throw new Error(`Response status: ${response.status}`);
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

  return { submitScore, getScoresByUser };
});
