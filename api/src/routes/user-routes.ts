import { Router } from "express";
import userController from "../controllers/user-controller.js";
import { validateBody } from "../middleware/validate-body.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserProfile);
router.delete("/:id", userController.deleteUser);

export default router;
