export type ScorePayload = {
  gamemode: string;
  map: string;
  score: number;
};

export type ScoreValidationState = {
  score: boolean | undefined;
};

export interface ScoreValidationResult {
  isValid: boolean;
  value: number | null;
}

type SubmitScoreOutcome = "created" | "updated" | "ignored";

export type ScoreResponseData = {
  _id: string;
  user: string;
  gamemode: string;
  map: string;
  score: number;
  timestamp: string; // ISO date str
};

// Success API Response
export type SubmitScoreResponse = {
  status: "success";
  data: ScoreResponseData;
  result: SubmitScoreOutcome;
};
