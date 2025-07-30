import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/api-errors.js";

// Check if request body exists
function requireBody(req: Request, res: Response, next: NextFunction) {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestError("Request body is missing");
  }
  next();
}

// WIP: Middleware for validating request body
export function validateBody(requiredProps: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireBody(req, res, () => {
      const missing = requiredProps.filter((prop) => !(prop in req.body));
      if (missing.length > 0) {
        throw new BadRequestError(
          `Missing required body property(ies): ${missing.join(", ")}`
        );
      }
      next();
    });
  };
}
