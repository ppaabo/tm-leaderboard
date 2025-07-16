import { Request, Response } from "express";
import Score from "../models/score.js";
import User from "../models/user.js";
import { userWithIdExists } from "../utils/userUtils.js";

class ScoreController {
  async addScore(req: Request, res: Response) {
    try {
      const { userId, gameMode, map, score, timestamp = undefined } = req.body;
      console.log(userId, gameMode, map, score, timestamp);
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
      res.status(201).json(newScore);
    } catch (err) {
      console.error("Add score error:", err);
      res.status(404).json({ message: "Error adding score", error: err });
    }
  }

  async getAllScores(req: Request, res: Response) {
    try {
      const scores = await Score.find();
      res.status(201).json(scores);
    } catch (error) {
      res.status(500).json({ message: "Error fetching all scores" });
    }
  }

  async getLeaderboard(req: Request, res: Response) {
    console.log(
      `getLeaderboard for gamemode: '${req.params.gamemode}', map: '${req.params.map}'`
    );
    res.status(404).json({ message: "Not Implemented" });
  }
}

export default new ScoreController();
