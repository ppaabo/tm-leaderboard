import userController from "@/controllers/user-controller.js";
import { requireAuth, requireRole } from "@/middleware/auth-middleware.js";
import { validateRouteParams } from "@/middleware/validate-request.js";
import { zUsername, zObjectId } from "@/schemas";
import { Router } from "express";
import { z } from "zod";

const router = Router();

// router.get("/:id", userController.getUserProfile);
router.delete("/me", requireAuth, userController.deleteOwnAccount);
router.get(
  "/:username/scores",
  validateRouteParams(z.object({ username: zUsername })),
  userController.getUserScoresWithPlacement,
);

// Admin routes
router.get(
  "/",
  requireAuth,
  requireRole(["admin"]),
  userController.getAllUsers,
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  validateRouteParams(z.object({ id: zObjectId })),
  userController.deleteUserAccount,
);

export default router;
