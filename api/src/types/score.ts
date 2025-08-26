import { Document, Types } from "mongoose";

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
