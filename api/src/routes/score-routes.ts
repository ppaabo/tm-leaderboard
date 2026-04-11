import { Router } from "express";
import scoreController from "../controllers/score-controller.js";
import { validateBody } from "../middleware/validate-body.js";
import { requireAuth } from "../middleware/auth-middleware.js";

const router = Router();

router.get("/", scoreController.queryScores);
router.post(
  "/",
  requireAuth,
  validateBody(["gamemode", "map", "score"]),
  scoreController.addScore,
);
router.get("/user/:username", scoreController.getScoresByUsername);
router.delete("/:score_id", requireAuth, scoreController.deleteOwnScore);

// router.get("/:gamemode/:map", scoreController.getLeaderboard);
// router.get("/", scoreController.getAllScores);

export default router;
