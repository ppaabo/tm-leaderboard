import mongoose from "mongoose";
import User from "../models/user.js";
import { NotFoundError, BadRequestError } from "./apiErrors.js";
export const userWithIdExists = async (userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError("Invalid user ID format");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return true;
};
