import { Request, Response } from "express";
import User from "../models/user.js";
import { userWithIdExists } from "../utils/user-utils.js";

class UserController {
  async getUserProfile(req: Request, res: Response) {
    const userId = req.params.id;
    await userWithIdExists(userId);
    // const user = await User.findById(userId).select({ email: 0 });
    const user = await User.findById(userId);
    res.json({ status: "success", data: user });
  }

  async getAllUsers(req: Request, res: Response) {
    // const users = await User.find().select({ email: 0 });
    const users = await User.find();
    res.json({ status: "success", data: users });
  }

  async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    await userWithIdExists(userId);
    await User.deleteOne({ _id: userId });
    res.status(204).end();
  }
}

export default new UserController();
