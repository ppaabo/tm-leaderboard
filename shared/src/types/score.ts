export type ScorePayload = {
  gamemode: string;
  map: string;
  score: number;
};

export type ScoreResponseData = {
  _id: string;
  user: string;
  gamemode: string;
  map: string;
  score: number;
  timestamp: string; // ISO date str
};

export type SubmitScoreOutcome = "created" | "updated" | "ignored";

export type SubmitScoreResponse = {
  status: "success";
  data: ScoreResponseData;
  result: SubmitScoreOutcome;
};
