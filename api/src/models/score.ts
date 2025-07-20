import mongoose, { Schema, Document } from "mongoose";

interface IScore extends Document {
  user: mongoose.Types.ObjectId;
  gameMode: string;
  map: string;
  score: number;
  timestamp?: Date;
}

const scoreSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  gameMode: { type: String, required: true },
  map: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Score = mongoose.model<IScore>("Score", scoreSchema);

export default Score;
