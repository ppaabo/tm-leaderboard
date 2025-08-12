import { Router } from "express";
import scoreController from "../controllers/score-controller.js";
import { validateBody } from "../middleware/validate-body.js";

const router = Router();

router.get("/", scoreController.getAllScores);
router.post(
  "/",
  validateBody(["user", "gamemode", "map", "score"]),
  scoreController.addScore
);

router.get("/:gamemode/:map", scoreController.getLeaderboard);
router.get("/:userId", scoreController.getScoresByUser);

export default router;
