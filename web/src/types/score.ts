export type ScoreValidationState = {
  score: boolean | undefined;
};

export interface ScoreValidationResult {
  isValid: boolean;
  value: number | null;
}

export const DeleteOwnScoreStatus = {
  Deleted: "deleted",
  NotFound: "notFound",
  Forbidden: "forbidden",
  Error: "error",
} as const;

export type DeleteOwnScoreStatus =
  (typeof DeleteOwnScoreStatus)[keyof typeof DeleteOwnScoreStatus];
