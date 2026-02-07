import express from "express";
import { getLeaderBoardData } from "../controllers/leaderboard_controller.js";
import { protect } from "../middlewares/protect.js";
const router = express.Router();

router.get("/:sessionId/results", protect, getLeaderBoardData);

export default router;

