export function formatTimeTrialScore(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedMs = milliseconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}.${formattedMs}`;
}

export function isValidTimeTrialScore(timeStr: string): boolean {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\.(\d{2})$/);
  if (!match) return false;
  const [_, minStr, secStr, msStr] = match;
  const minutes = Number(minStr);
  const seconds = Number(secStr);
  const milliseconds = Number(msStr);
  return (
    !isNaN(minutes) &&
    !isNaN(seconds) &&
    !isNaN(milliseconds) &&
    minutes >= 0 &&
    seconds >= 0 &&
    milliseconds >= 0 &&
    seconds <= 59 &&
    milliseconds <= 99
  );
}

export function timeTrialToMs(timeStr: string): number {
  const [min, sec, ms] = timeStr.split(/[:.]/).map(Number);
  return min * 60000 + sec * 1000 + ms * 10;
}
