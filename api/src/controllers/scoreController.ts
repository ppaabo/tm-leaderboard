import { Request, Response } from "express";
import Score from "../models/score.js";
import User from "../models/user.js";
import { userWithIdExists } from "../utils/userUtils.js";

class ScoreController {
  async addScore(req: Request, res: Response) {
    const { userId, gameMode, map, score, timestamp = undefined } = req.body;
    await userWithIdExists(userId);
    const newScore = await Score.create({
      userId,
      gameMode,
      map,
      score,
      timestamp,
    });
    console.log("Score added");
    // Update user's scores array
    await User.findByIdAndUpdate(newScore.userId, {
      $push: { scores: newScore._id },
    });
    const response = { status: "success", data: newScore };
    res.json(response);
  }

  async getAllScores(req: Request, res: Response) {
    const scores = await Score.find();
    const response = { status: "success", data: scores };
    res.json(response);
  }

  async getLeaderboard(req: Request, res: Response) {
    console.log(
      `getLeaderboard for gamemode: '${req.params.gamemode}', map: '${req.params.map}'`
    );
    res.status(404).json({ message: "Not Implemented" });
  }
}

export default new ScoreController();
