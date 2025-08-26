export type ScoreValidationState = {
  score: boolean | undefined;
};

export interface ScoreValidationResult {
  isValid: boolean;
  value: number | null;
}
