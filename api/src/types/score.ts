import { Document, Types } from "mongoose";
import { z } from "zod";

export interface IScore extends Document {
  user: Types.ObjectId;
  gamemode: string;
  map: string;
  score: number;
  timestamp?: Date;
}

export interface IGamemode extends Document {
  id: string;
  name: string;
}

export interface IMap extends Document {
  id: string;
  name: string;
}

export const ScorePayloadSchema = z.strictObject({
  gamemode: z.string(),
  map: z.string().min(1),
  score: z.number().min(1),
});
