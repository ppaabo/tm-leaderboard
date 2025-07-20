import { Router } from "express";
import scoreController from "../controllers/scoreController.js";
import { validateBody } from "../middleware/validateBody.js";

const router = Router();

router.get("/", scoreController.getAllScores);
router.post(
  "/",
  validateBody(["user", "gameMode", "map", "score"]),
  scoreController.addScore
);

router.get("/:gamemode/:map", scoreController.getLeaderboard);

export default router;
