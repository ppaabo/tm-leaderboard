export function formatTimeTrialScore(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedMs = milliseconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}.${formattedMs}`;
}
