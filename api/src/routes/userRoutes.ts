import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

router.get("/:id", userController.getUserProfile);
router.delete("/:id", userController.deleteUser);

export default router;
