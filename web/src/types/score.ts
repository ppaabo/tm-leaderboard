export type ScorePayload = {
  user: string;
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
