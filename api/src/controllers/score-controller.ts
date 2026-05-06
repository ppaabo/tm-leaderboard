import { Request, Response } from "express";
import type {
  ScorePayload,
  ScoreResponseData,
  SubmitScoreOutcome,
  SubmitScoreResponse,
} from "shared";
import { scoreQuerySchema } from "src/types/score.js";
import { Gamemode, Map } from "../models/score-metadata.js";
import Score from "../models/score.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/api-errors.js";
import {
  buildScoreFilter,
  parseScoreZodIssues,
  validateExists,
} from "../utils/score-utils.js";
import { userWithIdExists } from "../utils/user-utils.js";

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
    const paramsResult = scoreQuerySchema.safeParse(req.query);
    if (!paramsResult.success) {
      const message = parseScoreZodIssues(paramsResult.error.issues);
      throw new BadRequestError(message);
    }
    const filter = await buildScoreFilter(paramsResult.data);
    let sortDirection: string | undefined;
    if (filter.gamemode && filter.map) {
      sortDirection = filter.gamemode === "time-trial" ? "score" : "-score";
    } else {
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
