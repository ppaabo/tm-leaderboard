import { Router } from "express";
import scoreController from "../controllers/score-controller.js";
import { validateBody } from "../middleware/validate-body.js";

const router = Router();

router.get("/", scoreController.queryScores);
router.post(
  "/",
  validateBody(["user", "gamemode", "map", "score"]),
  scoreController.addScore
);
router.get("/user/:username", scoreController.getScoresByUsername);

// router.get("/:gamemode/:map", scoreController.getLeaderboard);
// router.get("/", scoreController.getAllScores);

export default router;
