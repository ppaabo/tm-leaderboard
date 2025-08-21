import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/api-errors.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Not logged in");
  } else next();
}
