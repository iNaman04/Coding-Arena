import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';

export const protect = (async(req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }
        req.user = user;    
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
})