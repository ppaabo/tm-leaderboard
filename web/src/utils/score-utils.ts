import type { ScoreValidationResult } from "@/types";
export function formatTimeTrialScore(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedMs = milliseconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}.${formattedMs}`;
}

export function parseTimeTrialScore(timeStr: string): number {
  // "m:ss.ms" or "mm:ss.ms"
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\.(\d{2})$/);
  if (!match) {
    throw new Error("Invalid time format");
  }
  const [_, minStr, secStr, msStr] = match;
  const minutes = Number(minStr);
  const seconds = Number(secStr);
  const milliseconds = Number(msStr);

  if (
    isNaN(minutes) ||
    isNaN(seconds) ||
    isNaN(milliseconds) ||
    minutes < 0 ||
    seconds < 0 ||
    milliseconds < 0 ||
    seconds > 59 ||
    milliseconds > 99
  ) {
    throw new Error("Invalid time values");
  }

  return minutes * 60000 + seconds * 1000 + milliseconds * 10;
}

export function validateScore(
  input: string,
  type: "text" | "number",
): ScoreValidationResult {
  if (!input) {
    return { isValid: false, value: null };
  }

  if (type === "text") {
    const value = input.trim();
    const timeTrialRegex = /^\d{1,2}:\d{2}\.\d{2}$/;

    if (timeTrialRegex.test(value)) {
      try {
        const parsed = parseTimeTrialScore(value);
        return { isValid: true, value: parsed };
      } catch (error) {
        return { isValid: false, value: null };
      }
    }
    return { isValid: false, value: null };
  }

  const num = Number(input);
  if (!isNaN(num) && num >= 0) {
    return { isValid: true, value: num };
  }

  return { isValid: false, value: null };
}
