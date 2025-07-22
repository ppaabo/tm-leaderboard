import { Router } from "express";
import userController from "../controllers/userController.js";
import { validateBody } from "../middleware/validateBody.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.post(
  "/",
  validateBody(["username", "email"]),
  userController.createUser
);

router.get("/:id", userController.getUserProfile);
router.delete("/:id", userController.deleteUser);

export default router;
