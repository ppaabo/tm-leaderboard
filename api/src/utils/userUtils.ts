import mongoose from "mongoose";
import User from "../models/user.js";
import { NotFoundError, BadRequestError } from "./apiErrors.js";
export const userWithIdExists = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError("Invalid user ID format");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return true;
};

export const validateUserRegistration = async (
  username: string,
  email: string
) => {
  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    throw new BadRequestError("Username is already in use");
  }
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new BadRequestError("Email is already in use");
  }
  return true;
};
