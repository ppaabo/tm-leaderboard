import { z } from "zod";

export const ScorePayloadSchema = z.strictObject({
  gamemode: z.string(),
  map: z.string().min(1),
  score: z.number().min(1),
});

export const scoreQuerySchema = z.strictObject({
  gamemode: z.string().min(1).optional(),
  map: z.string().min(1).optional(),
  username: z.string().min(4).optional(),
});
