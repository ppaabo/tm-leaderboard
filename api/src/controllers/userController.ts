import { Request, Response } from "express";
import User from "../models/user.js";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email = undefined } = req.body;
      const newUser = await User.create({ username, email });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId)
        .select({ email: 0 })
        .populate("scores");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching user profile", error: err });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select({ email: 0 }).populate("scores");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users", error: err });
    }
  }

  async deleteUser(req: Request, res: Response) {
    res.status(404).json({ message: "Not implemented" });
  }
}

export default new UserController();
