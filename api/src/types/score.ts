import { Document, Types } from "mongoose";
import { z } from "zod";
import { scoreQuerySchema } from "@/schemas";

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

export type ScoreQueryParams = z.infer<typeof scoreQuerySchema>;
