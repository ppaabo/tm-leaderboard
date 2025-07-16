import mongoose from "mongoose";
import User from "../models/user.js";
export const userWithIdExists = async (userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return true;
};
