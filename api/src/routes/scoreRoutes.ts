import { Router } from "express";
import scoreController from "../controllers/scoreController.js";

const router = Router();

router.get("/", scoreController.getAllScores);
router.post("/", scoreController.addScore);

router.get("/:gamemode/:map", scoreController.getLeaderboard);

export default router;
