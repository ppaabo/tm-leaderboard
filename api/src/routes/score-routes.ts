import scoreController from "@/controllers/score-controller.js";
import { requireAuth } from "@/middleware/auth-middleware.js";
import {
  validateBodyWithSchema,
  validateRouteParams,
  validateQueryScoresParams,
} from "@/middleware/validate-request.js";
import { ScorePayloadSchema, zObjectId } from "@/schemas";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.get("/", validateQueryScoresParams, scoreController.queryScores);
router.post(
  "/",
  requireAuth,
  validateBodyWithSchema(ScorePayloadSchema),
  scoreController.addScore,
);
router.delete(
  "/:score_id",
  requireAuth,
  validateRouteParams(z.object({ score_id: zObjectId })),
  scoreController.deleteOwnScore,
);

export default router;
