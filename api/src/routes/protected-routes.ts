import { Router } from "express";
import { requireRole, requireAuth } from "../middleware/auth-middleware.js";
import userController from "../controllers/user-controller.js";

const router = Router();

router.get(
  "/users",
  requireAuth,
  requireRole(["admin"]),
  userController.getAllUsers
);

router.delete(
  "/users/:id",
  requireAuth,
  requireRole(["admin"]),
  userController.deleteUserAccount
);

export default router;
