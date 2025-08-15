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
    const newScore = await Score.create({
      user,
      gamemode,
      map,
      score,
      timestamp,
    });
    console.log("Score added: ", newScore);
    res.json({ status: "success", data: newScore });
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

// async getLeaderboard(req: Request, res: Response) {
//   const gamemode = req.params.gamemode;
//   const map = req.params.map;
//   // check if  gamemode and map exist
//   const gamemodeExists = await Gamemode.findOne({ id: gamemode });
//   if (!gamemodeExists) {
//     throw new NotFoundError(`Gamemode '${gamemode}' not found`);
//   }
//   const mapExists = await Map.findOne({ id: map });
//   if (!mapExists) {
//     throw new NotFoundError(`Map '${map}' not found`);
//   }
//   const sortDirection = gamemode === "time-trial" ? "score" : "-score";
//   const leaderboard = await Score.find({
//     gamemode,
//     map,
//   })
//     .sort(sortDirection)
//     .populate("user", "username");

//   res.json({ status: "success", data: leaderboard });
// }

//   async getAllScores(req: Request, res: Response) {
//   const scores = await Score.find().populate("user", "username");
//   res.json({ status: "success", data: scores });
// }

// async getScoresByUserId(req: Request, res: Response) {
//   const userId = req.params.userId;
//   await userWithIdExists(userId);
//   const scores = await Score.find({ user: userId })
//     .sort({ timestamp: -1 })
//     .populate("user", "username");
//   res.json({ status: "success", data: scores });
// }
