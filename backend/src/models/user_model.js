import mongoose from "mongoose";
import express from "express";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentSocketId : { type: String, default: null },
  wins: { type: Number, default: 0 },
  totalBattles: { type: Number, default: 0 },
  exp: { type: Number, default: 0 }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;