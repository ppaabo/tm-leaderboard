export type LeaderboardUser = {
  _id: string;
  username: string;
};

export interface LeaderboardEntryData {
  _id: string;
  user: LeaderboardUser;
  gamemode: string;
  map: string;
  score: number;
  timestamp: string;
}

export interface LeaderboardEntryDisplay
  extends Omit<LeaderboardEntryData, "score"> {
  score: string;
  rawScore?: number;
}
