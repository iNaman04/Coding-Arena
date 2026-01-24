import { getBattleData } from "../controllers/battle_controller.js";
import express from 'express';
import { protect } from '../middlewares/protect.js';
import { runCode } from "../controllers/battle_controller.js";

const router = express.Router();

router.post("/run-code", runCode);
router.post("/:SessionId", protect, getBattleData);

export default router;  