import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/api-errors.js";
import { ZodType } from "zod";

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
          `Missing required body property(ies): ${missing.join(", ")}`,
        );
      }
      next();
    });
  };
}

export function validateBodyWithSchema(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new BadRequestError(message);
    }
    req.body = result.data;
    next();
  };
}
