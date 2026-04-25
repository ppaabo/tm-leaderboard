import { Request, Response } from "express";
import Score from "../models/score.js";
import User from "../models/user.js";
import { getUserByName, userWithIdExists } from "../utils/user-utils.js";

class UserController {
  async getUserProfile(req: Request, res: Response) {
    const userId = req.params.id;
    await userWithIdExists(userId);
    // const user = await User.findById(userId).select({ email: 0 });
    const user = await User.findById(userId);
    res.json({ status: "success", data: user });
  }

  async deleteOwnAccount(req: Request, res: Response) {
    const userId = req.user!._id.toString();
    await userWithIdExists(userId);
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    console.log("Deleted user: ", deletedUser);
    res.status(204).end();
  }

  // Protected operations
  async getAllUsers(req: Request, res: Response) {
    // const users = await User.find().select({ email: 0 });
    const users = await User.find();
    res.json({ status: "success", data: users });
  }

  async deleteUserAccount(req: Request, res: Response) {
    const userId = req.params.id;
    await userWithIdExists(userId);
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    console.log("Deleted user: ", deletedUser);
    res.status(204).end();
  }

  async getUserScoresWithPlacement(req: Request, res: Response) {
    const username = req.params.username;
    const user = await getUserByName(username);
    const userScores = await Score.find({ user: user._id })
      .populate("user", "username")
      .lean();
    const scoresWithPlacements = await Promise.all(
      userScores.map(async (score) => {
        const filter = {
          gamemode: score.gamemode,
          map: score.map,
        };
        let betterCount;
        if (score.gamemode === "time-trial") {
          // lower = better
          betterCount = await Score.countDocuments({
            ...filter,
            score: { $lt: score.score },
          });
        } else {
          // higher = better
          betterCount = await Score.countDocuments({
            ...filter,
            score: { $gt: score.score },
          });
        }
        return {
          ...score,
          placement: betterCount + 1,
        };
      }),
    );
    res.json({ status: "success", data: scoresWithPlacements });
  }
}

export default new UserController();
