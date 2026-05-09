import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/utils/api-errors.js";
import { ZodType } from "zod";
import { scoreQuerySchema } from "@/schemas";
import { parseScoreZodIssues } from "@/utils/score-utils.js";

// Check if request body exists
function requireBody(req: Request, res: Response, next: NextFunction) {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestError("Request body is missing");
  }
  next();
}

export function validateBodyWithSchema(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireBody(req, res, () => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const message = result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ");
        throw new BadRequestError(message);
      }
      req.body = result.data;
      next();
    });
  };
}

export function validateRouteParams(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new BadRequestError(message);
    }
    next();
  };
}

export function validateQueryScoresParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = scoreQuerySchema.safeParse(req.query);
  if (!result.success) {
    const message = parseScoreZodIssues(result.error.issues);
    throw new BadRequestError(message);
  }
  next();
}
