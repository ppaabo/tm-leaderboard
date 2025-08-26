import { Request, Response } from "express";
import Score from "../models/score.js";
import { userWithIdExists } from "../utils/user-utils.js";
import User from "../models/user.js";
import { NotFoundError } from "../utils/api-errors.js";
import { Gamemode, Map } from "../models/score-metadata.js";
import { buildFilter, validateExists } from "../utils/score-utils.js";
import type {
  ScorePayload,
  SubmitScoreResponse,
  SubmitScoreOutcome,
  ScoreResponseData,
} from "shared";

class ScoreController {
  async addScore(req: Request, res: Response) {
    const userId: string = req.user!._id.toString();
    let { gamemode, map, score } = req.body as ScorePayload;
    gamemode = gamemode.toLowerCase();
    map = map.toLowerCase();
    await userWithIdExists(userId);
    await validateExists(Gamemode, "Gamemode", gamemode as string);
    await validateExists(Map, "Map", map as string);

    const filter = { user: userId, gamemode, map };
    let update;
    // Update if new score is better than old one
    if (gamemode === "time-trial") {
      update = {
        $min: { score },
        timestamp: new Date(),
      };
    } else {
      update = {
        $max: { score },
        timestamp: new Date(),
      };
    }
    const result = await Score.findOneAndUpdate(filter, update, {
      upsert: true,
      runValidators: true,
      new: true,
      includeResultMetadata: true,
      select: "-__v",
    });

    const updatedExisting = result.lastErrorObject?.updatedExisting ?? false;
    const scoreChanged = result.value?.score === score;

    let outcome: SubmitScoreOutcome;
    if (!updatedExisting) outcome = "created";
    else outcome = scoreChanged ? "updated" : "ignored";

    const response: SubmitScoreResponse = {
      status: "success",
      data: result.value as unknown as ScoreResponseData,
      result: outcome,
    };

    res.status(outcome === "created" ? 201 : 200).json(response);
  }

  async getScoresByUsername(req: Request, res: Response) {
    const username = req.params.username;
    const user = await User.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const scores = await Score.find({ user: user._id })
      .sort({ timestamp: -1 })
      .populate("user", "username");

    res.json({ status: "success", data: scores });
  }

  async queryScores(req: Request, res: Response) {
    const filter = buildFilter(req.query, ["gamemode", "map"]);
    await validateExists(Gamemode, "Gamemode", filter.gamemode as string);
    await validateExists(Map, "Map", filter.map as string);

    let sortDirection: string | undefined;
    if (filter.gamemode && filter.map) {
      sortDirection = filter.gamemode === "time-trial" ? "score" : "-score";
    }

    const scores = await Score.find(filter)
      .sort(sortDirection)
      .populate("user", "username");

    res.json({ status: "success", data: scores });
  }
}

export default new ScoreController();
