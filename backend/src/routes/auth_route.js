import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import { signup, login } from '../controllers/auth_controller.js';


const router = express.Router();

router.post(('/signup'), signup);

router.post(('/login'), login);


export default router;