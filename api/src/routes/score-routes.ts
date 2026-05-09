import scoreController from "@/controllers/score-controller.js";
import { requireAuth } from "@/middleware/auth-middleware.js";
import { validateBodyWithSchema } from "@/middleware/validate-body.js";
import { ScorePayloadSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.get("/", scoreController.queryScores);
router.post(
  "/",
  requireAuth,
  validateBodyWithSchema(ScorePayloadSchema),
  scoreController.addScore,
);
router.delete("/:score_id", requireAuth, scoreController.deleteOwnScore);

export default router;
