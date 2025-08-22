import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../utils/api-errors.js";
import { IUser } from "../types/user.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Not logged in");
  } else next();
}

export function requireRole(roles: Array<IUser["accountType"]>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.user!.accountType)) return next();
    throw new ForbiddenError("Forbidden");
  };
}
