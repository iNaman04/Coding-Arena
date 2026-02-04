import { getBattleData } from "../controllers/battle_controller.js";
import express from 'express';
import { protect } from '../middlewares/protect.js';
import { runCode, submitCode } from "../controllers/battle_controller.js";

const router = express.Router();

router.post("/run-code", protect, runCode);
router.post("/submit", protect, submitCode);
router.post("/:sessionId", protect, getBattleData);

export default router;  