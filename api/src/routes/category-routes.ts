import { Router } from "express";
import categoryController from "../controllers/category-controller.js";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/gamemodes", categoryController.getAllGamemodes);
router.get("/maps", categoryController.getAllMaps);

export default router;
