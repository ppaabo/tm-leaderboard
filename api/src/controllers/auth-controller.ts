import { Request, Response } from "express";
import User from "../models/user.js";
import { ApiError, BadRequestError } from "../utils/api-errors.js";
import { validateUserRegistration } from "../utils/user-utils.js";
import bcrypt from "bcrypt";
import type { LoginResponsePayload, IUser } from "../types/index.js";

class AuthController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      await validateUserRegistration(username, email);
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hash });
      console.log("User created: ", newUser);
      res.status(201).json({ status: "success", message: "User created" });
    } catch (error: unknown) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new ApiError(
        "Error creating user",
        500,
        error instanceof Error ? error : undefined
      );
    }
  }

  loginUser(req: Request, res: Response) {
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const response: LoginResponsePayload = {
      id: user._id?.toString(),
      username: user.username,
      accountType: user.accountType,
    };
    res.json({ status: "success", data: response });
  }

  logoutUser(req: Request, res: Response) {
    req.logout((error) => {
      if (error)
        return res
          .status(500)
          .json({ status: "error", message: "Logout failed" });
      res.json({ status: "success", data: "Logged out" });
    });
  }

  getMe(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
      return res
        .status(401)
        .json({ status: "error", message: "Not logged in" });
    }
    res.json({ status: "success", data: req.user });
  }
}

export default new AuthController();
