import { Request, Response } from "express";
import User from "../models/user.js";
import { ApiError, BadRequestError } from "../utils/apiErrors.js";
import { userWithIdExists } from "../utils/userUtils.js";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email = undefined } = req.body;
      const newUser = await User.create({ username, email });
      const response = { status: "success", data: newUser };
      res.status(201).json(response);
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code === 11000) {
        throw new BadRequestError("Username already exists", err as Error);
      }
      throw new ApiError(
        "Error creating user",
        500,
        err instanceof Error ? err : undefined
      );
    }
  }

  async getUserProfile(req: Request, res: Response) {
    const userId = req.params.id;
    await userWithIdExists(userId);
    // const user = await User.findById(userId).select({ email: 0 });
    const user = await User.findById(userId);
    const response = { status: "success", data: user };
    res.json(response);
  }

  async getAllUsers(req: Request, res: Response) {
    // const users = await User.find().select({ email: 0 });
    const users = await User.find();
    const response = { status: "success", data: users };
    res.json(response);
  }

  async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    await userWithIdExists(userId);
    await User.deleteOne({ _id: userId });
    res.status(204).end();
  }
}

export default new UserController();
