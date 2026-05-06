import { type ScoreQueryParams } from "src/types/score.js";
import type { ZodError } from "zod";
import { Gamemode, Map } from "../models/score-metadata.js";
import { NotFoundError } from "./api-errors.js";
import { getUserByName } from "./user-utils.js";

export function parseScoreZodIssues(issues: ZodError["issues"]): string {
  const messages = issues.map((issue) => {
    if (issue.path[0] === "username") {
      return "username must be a string and at least 4 characters";
    }
    if (issue.path[0] === "gamemode") {
      return "gamemode must be a non-empty string";
    }
    if (issue.path[0] === "map") {
      return "map must be a non-empty string";
    }
    return issue.message;
  });
  return messages.join("; ");
}

export async function buildScoreFilter(
  params: ScoreQueryParams,
): Promise<Record<string, string>> {
  const filter: Record<string, string> = {};

  if (params.gamemode) {
    await validateExists(Gamemode, "Gamemode", params.gamemode);
    filter.gamemode = params.gamemode;
  }
  if (params.map) {
    await validateExists(Map, "Map", params.map);
    filter.map = params.map;
  }
  if (params.username) {
    const user = await getUserByName(params.username);
    filter.user = user._id.toString();
  }

  return filter;
}

export const validateExists = async (
  Model: any,
  field: string,
  value: string,
) => {
  if (!value) return;
  const exists = await Model.findOne({ id: value });
  if (!exists) {
    throw new NotFoundError(`${field} '${value}' not found`);
  }
};
