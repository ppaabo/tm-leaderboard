import mongoose, { Schema, Document } from "mongoose";

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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
