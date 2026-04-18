import { Request, Response } from "express";
import Score from "../models/score.js";
import { getUserByName, userWithIdExists } from "../utils/user-utils.js";
import User from "../models/user.js";
import { ForbiddenError, NotFoundError } from "../utils/api-errors.js";
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

  async queryScores(req: Request, res: Response) {
    // fck typescript...:DDDDDDDDDDDDDDDDDD
    const filter = buildFilter(req.query as Record<string, any>, [
      "gamemode",
      "map",
      "username",
    ]) as Record<string, any>;
    await validateExists(Gamemode, "Gamemode", filter.gamemode as string);
    await validateExists(Map, "Map", filter.map as string);

    // get user's objectId for filter
    if (filter.username) {
      const user = await getUserByName(filter.username);
      filter.user = user._id.toString();
      delete filter.username;
    }

    let sortDirection: string | undefined;
    if (filter.gamemode && filter.map) {
      sortDirection = filter.gamemode === "time-trial" ? "score" : "-score";
    } else if (filter.user) {
      sortDirection = "-timestamp";
    }

    const scores = await Score.find(filter)
      .sort(sortDirection)
      .populate("user", "username");

    res.json({ status: "success", data: scores });
  }

  async deleteOwnScore(req: Request, res: Response) {
    const score_id = req.params.score_id;
    const userId = req.user!._id.toString();

    const score = await Score.findById(score_id);
    if (!score) {
      throw new NotFoundError("Score not found");
    }
    if (score.user.toString() !== userId) {
      throw new ForbiddenError("Forbidden");
    }
    await Score.deleteOne({ _id: score_id });
    console.log("Deleted score: ", score);
    return res.status(204).end();
  }
}

export default new ScoreController();
