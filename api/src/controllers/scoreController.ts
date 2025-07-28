import { Request, Response } from "express";
import Score from "../models/score.js";
import { userWithIdExists } from "../utils/userUtils.js";

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

  async getAllScores(req: Request, res: Response) {
    const scores = await Score.find().populate("user", "username");
    res.json({ status: "success", data: scores });
  }

  async getLeaderboard(req: Request, res: Response) {
    const gamemode = req.params.gamemode;
    const map = req.params.map;
    const sortDirection = gamemode === "time-trial" ? "score" : "-score";
    const leaderboard = await Score.find({
      gamemode,
      map,
    })
      .sort(sortDirection)
      .populate("user", "username");

    res.json({ status: "success", data: leaderboard });
    // const leaderboard = await Score.find({
    //   gamemode: new RegExp(`^${gamemode}$`, "i"),
    //   map: new RegExp(`^${map}$`, "i"),
    // }).populate("user", "username");
  }
}

export default new ScoreController();
