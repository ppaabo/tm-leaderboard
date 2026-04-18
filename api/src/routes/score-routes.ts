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
router.delete("/:score_id", requireAuth, scoreController.deleteOwnScore);

export default router;
