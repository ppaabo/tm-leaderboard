import mongoose from "mongoose";
import User from "../models/user.js";
import { NotFoundError, BadRequestError } from "./api-errors.js";

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
  email: string,
) => {
  const existingUserByUsername = await User.findOne({
    username: new RegExp(`^${username}$`, "i"),
  });
  if (existingUserByUsername) {
    throw new BadRequestError("Username is already in use");
  }
  const existingUserByEmail = await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });
  if (existingUserByEmail) {
    throw new BadRequestError("Email is already in use");
  }
  return true;
};

export const getUserByName = async (username: string) => {
  const user = await User.findOne({
    username: new RegExp(`^${username}$`, "i"),
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};
