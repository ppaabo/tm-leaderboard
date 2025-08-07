import { defineStore } from "pinia";
import type { ScorePayload } from "@/types";

export const useScoreStore = defineStore("score", () => {
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
        return data;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error("submitScore", error);
    }
  }

  return { submitScore };
});
