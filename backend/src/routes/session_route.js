import { create } from 'domain';
import express from 'express';
import { protect } from '../middlewares/protect.js';
import { createSession } from '../controllers/session_controller.js';

const router = express.Router();

router.post("/create", protect, createSession);
export default router;