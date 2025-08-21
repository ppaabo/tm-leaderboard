import { Router } from "express";
import authController from "../controllers/auth-controller.js";
import passport from "passport";
import { validateBody } from "../middleware/validate-body.js";
import { requireAuth } from "../middleware/auth-middleware.js";

const router = Router();
router.post(
  "/signup",
  validateBody(["username", "email", "password"]),
  authController.createUser
);
router.post("/login", passport.authenticate("local"), authController.loginUser);
router.post("/logout", requireAuth, authController.logoutUser);
router.get("/me", requireAuth, authController.getMe);

export default router;
