import { Request, Response } from "express";
import User from "../models/user.js";
import { ApiError } from "../utils/apiError.js";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email = undefined } = req.body;
      const newUser = await User.create({ username, email });
      const response = { status: "success", data: newUser };
      res.status(201).json(response);
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ApiError("Username already exists", 409);
      }
      throw new ApiError("Error creating user", 500);
    }
  }

  async getUserProfile(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId)
        .select({ email: 0 })
        .populate("scores");
      if (!user) {
        throw new ApiError("User not found", 404);
      }
      const response = { status: "success", data: user };
      res.json(response);
    } catch (err) {
      throw new ApiError("Error fetching user profile", 500);
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select({ email: 0 }).populate("scores");
      const response = { status: "success", data: users };
      res.json(response);
    } catch (err) {
      throw new ApiError("Error fetching users", 500);
    }
  }

  async deleteUser(req: Request, res: Response) {
    throw new ApiError("Not implemented", 404);
  }
}

export default new UserController();
