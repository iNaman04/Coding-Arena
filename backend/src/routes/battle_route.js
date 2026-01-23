import { getBattleData } from "../controllers/battle_controller.js";
import express from 'express';
import { protect } from '../middlewares/protect.js';

const router = express.Router();

router.post("/:SessionId", protect, getBattleData);

export default router;