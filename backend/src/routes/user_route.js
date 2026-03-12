// backend/src/routes/user_routes.js
import express from "express";
import { getUserInfo } from "../controllers/user_controller.js";
import { protect } from "../middlewares/protect.js"; 

const router = express.Router();

// This matches the /users/me call from your frontend
router.get("/UserInfo", protect, getUserInfo);

export default router;