import { Request, Response } from "express";
import Score from "../models/score.js";
import { userWithIdExists } from "../utils/user-utils.js";
import User from "../models/user.js";
import { NotFoundError } from "../utils/api-errors.js";
import { Gamemode, Map } from "../models/score-metadata.js";
import { buildFilter, validateExists } from "../utils/score-utils.js";

class ScoreController {
  async addScore(req: Request, res: Response) {
    const { user, gamemode, map, score, timestamp = undefined } = req.body;
    await userWithIdExists(user);
    await validateExists(Gamemode, "Gamemode", gamemode as string);
    await validateExists(Map, "Map", map as string);

    const filter = { user, gamemode, map };
    let update;
    // Update if new score is better than old one
    if (gamemode === "time-trial") {
      update = {
        $min: { score },
        timestamp: timestamp || new Date(),
      };
    } else {
      update = {
        $max: { score },
        timestamp: timestamp || new Date(),
      };
    }
    const doc = await Score.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });

    if (doc.score === score) console.log("Score updated");
    if (doc.score !== score) console.log("Score was not updated");
    res.json({ status: "success", data: doc });
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
