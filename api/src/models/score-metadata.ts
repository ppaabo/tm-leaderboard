import mongoose, { Schema, Document } from "mongoose";

export interface IGamemode extends Document {
  id: string;
  name: string;
}

const gamemodeSchema = new Schema<IGamemode>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export const Gamemode = mongoose.model<IGamemode>("Gamemode", gamemodeSchema);

export interface IMap extends Document {
  id: string;
  name: string;
}

const mapSchema = new Schema<IMap>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export const Map = mongoose.model<IMap>("Map", mapSchema);
