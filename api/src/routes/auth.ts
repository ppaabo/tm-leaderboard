import { Router } from "express";
import authController from "../controllers/authController.js";
import passport from "passport";
import { validateBody } from "../middleware/validateBody.js";

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
