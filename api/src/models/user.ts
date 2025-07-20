import mongoose, { Schema, Document } from "mongoose";
import Score from "./score.js";

interface IUser extends Document {
  username: string;
  email?: string;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
});
// Delete user scores
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
