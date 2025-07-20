import { Request, Response } from "express";
import Score from "../models/score.js";
import { userWithIdExists } from "../utils/userUtils.js";

class ScoreController {
  async addScore(req: Request, res: Response) {
    const { user, gameMode, map, score, timestamp = undefined } = req.body;
    await userWithIdExists(user);
    const newScore = await Score.create({
      user,
      gameMode,
      map,
      score,
      timestamp,
    });
    console.log("Score added: ", newScore);
    const response = { status: "success", data: newScore };
    res.json(response);
  }

  async getAllScores(req: Request, res: Response) {
    const scores = await Score.find().populate("user", "username");
    res.json({ status: "success", data: scores });
  }

  async getLeaderboard(req: Request, res: Response) {
    console.log(
      `getLeaderboard for gamemode: '${req.params.gamemode}', map: '${req.params.map}'`
    );
    res.status(404).json({ message: "Not Implemented" });
  }
}

export default new ScoreController();
