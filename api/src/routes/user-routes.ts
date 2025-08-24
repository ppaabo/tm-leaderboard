import { Router } from "express";
import userController from "../controllers/user-controller.js";
import { requireAuth } from "../middleware/auth-middleware.js";

const router = Router();

// router.get("/:id", userController.getUserProfile);
router.delete("/me", requireAuth, userController.deleteOwnAccount);

export default router;
