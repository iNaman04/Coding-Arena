import { create } from 'domain';
import express from 'express';
import { protect } from '../middlewares/protect.js';
import { createSession } from '../controllers/session_controller.js';
import { join } from 'path';

const router = express.Router();

router.post("/create", protect, createSession);
router.post("/join", protect, joinSession);
export default router;