import { Router } from "express";
import passport from "passport";
import { logInSchema, signUpSchema } from "src/types/user.js";
import authController from "../controllers/auth-controller.js";
import { requireAuth } from "../middleware/auth-middleware.js";
import { validateBodyWithSchema } from "../middleware/validate-body.js";

const router = Router();
router.post(
  "/signup",
  validateBodyWithSchema(signUpSchema),
  authController.createUser,
);
router.post(
  "/login",
  validateBodyWithSchema(logInSchema),
  passport.authenticate("local"),
  authController.loginUser,
);
router.post("/logout", requireAuth, authController.logoutUser);
router.get("/me", requireAuth, authController.getMe);

export default router;
