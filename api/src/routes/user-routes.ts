import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";

const router = Router();

// router.get("/:id", userController.getUserProfile);
router.delete("/me", requireAuth, userController.deleteOwnAccount);

// Admin routes
router.get(
  "/",
  requireAuth,
  requireRole(["admin"]),
  userController.getAllUsers
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  userController.deleteUserAccount
);

export default router;
