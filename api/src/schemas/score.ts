import { z } from "zod";

export const ScorePayloadSchema = z.strictObject({
  gamemode: z.string().min(1).max(32),
  map: z.string().min(1).max(32),
  score: z.number().min(1),
});

export const scoreQuerySchema = z.strictObject({
  gamemode: z.string().min(1).max(32).optional(),
  map: z.string().min(1).max(32).optional(),
  username: z.string().min(4).max(32).optional(),
});
