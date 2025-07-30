import { Router } from "express";
import authController from "../controllers/auth-controller.js";
import passport from "passport";
import { validateBody } from "../middleware/validate-body.js";

const router = Router();
router.post(
  "/signup",
  validateBody(["username", "email", "password"]),
  authController.createUser
);
router.post("/login", passport.authenticate("local"), authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/me", authController.getMe);

export default router;
