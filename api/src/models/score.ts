import mongoose, { Schema, Document } from "mongoose";
import type { IScore } from "../types/index.js";

const scoreSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  gamemode: { type: String, required: true },
  map: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

scoreSchema.pre<IScore>("save", function (next) {
  if (this.gamemode) this.gamemode = this.gamemode.toLowerCase();
  if (this.map) this.map = this.map.toLowerCase();
  next();
});

scoreSchema.index({ user: 1, gamemode: 1, map: 1 }, { unique: true });

const Score = mongoose.model<IScore>("Score", scoreSchema);

export default Score;
