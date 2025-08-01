import mongoose, { Schema, Document } from "mongoose";
import Score from "./score.js";
import type { IUser } from "../types/index.js";

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Delete user's scores
userSchema.pre(
  "deleteOne",
  { query: true, document: false },
  async function (next) {
    const userId = this.getFilter()._id;
    await Score.deleteMany({ user: userId });
    next();
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
