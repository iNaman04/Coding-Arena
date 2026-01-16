import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import { signup, login, checkAuth, logout } from '../controllers/auth_controller.js';
import { protect } from '../middlewares/protect.js';


const router = express.Router();

router.post(('/signup'), signup);

router.post(('/login'), login);

router.get('/check-auth', protect, checkAuth);

router.post('/logout', logout)


export default router;