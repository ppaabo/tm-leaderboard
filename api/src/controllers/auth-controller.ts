import { Request, Response } from "express";
import User from "../models/user.js";
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
} from "../utils/api-errors.js";
import { validateUserRegistration } from "../utils/user-utils.js";
import bcrypt from "bcrypt";
import type { AuthUser } from "shared";

class AuthController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      await validateUserRegistration(username, email);
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hash });

      // Log the user in after signup
      req.login(newUser, (err) => {
        if (err) {
          throw new ApiError("Auto-login after signup failed", 500, err);
        }

        const response: AuthUser = {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          accountType: newUser.accountType,
        };
        res.status(201).json({ status: "success", data: response });
      });
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
    const user = req.user;
    // This should be unnecesary to check
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const response: AuthUser = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      accountType: user.accountType,
    };
    res.json({ status: "success", data: response });
  }

  logoutUser(req: Request, res: Response) {
    req.logout((error) => {
      if (error) {
        throw new ApiError("Logout failed", 500, error);
      }
      res.json({ status: "success", data: "Logged out" });
    });
  }

  getMe(req: Request, res: Response) {
    const user = req.user!;
    const response: AuthUser = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      accountType: user.accountType,
    };
    res.json({ status: "success", data: response });
  }
}

export default new AuthController();
