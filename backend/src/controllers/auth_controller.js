import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';

export const signup = async (req, res) => {
     const { username, email, password } = req.body;
     
    try {
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const isExist = await User.findOne({ email });
        if(isExist){
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPasword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPasword });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        }); 
        return res.status(200).json({ id : newUser._id, username : newUser.username } );
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        });
        return res.status(200).json({ id : user._id, username : user.username } );
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({ message: "checkAuth failed" });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
}