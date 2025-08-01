import mongoose, { Schema, Document } from "mongoose";
import type { IGamemode, IMap } from "../types/score.js";

const gamemodeSchema = new Schema<IGamemode>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export const Gamemode = mongoose.model<IGamemode>("Gamemode", gamemodeSchema);

const mapSchema = new Schema<IMap>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export const Map = mongoose.model<IMap>("Map", mapSchema);
