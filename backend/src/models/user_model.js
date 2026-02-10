import mongoose from "mongoose";
import express from "express";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentSocketId : { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;