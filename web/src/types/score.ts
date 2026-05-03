import { z } from "zod";
import { isValidTimeTrialScore } from "@/utils/score-utils";

export const DeleteOwnScoreStatus = {
  Deleted: "deleted",
  NotFound: "notFound",
  Forbidden: "forbidden",
  Error: "error",
} as const;

export type DeleteOwnScoreStatus =
  (typeof DeleteOwnScoreStatus)[keyof typeof DeleteOwnScoreStatus];

const timeTrialSchema = z.object({
  gamemode: z.literal("time-trial"),
  map: z.string().min(1, { error: "Map is required" }),
  score: z
    .string()
    .regex(/^\d{1,2}:\d{2}\.\d{2}$/, { error: "Format must be mm:ss.ms" })
    .refine(isValidTimeTrialScore, { error: "Invalid time value" }),
});

const freestyleSchema = z.object({
  gamemode: z.literal("freestyle"),
  map: z.string().min(1, { error: "Map is required" }),
  score: z.number().min(0, { error: "Score must be a positive number" }),
});

export const submitScoreSchema = z.discriminatedUnion("gamemode", [
  timeTrialSchema,
  freestyleSchema,
]);
