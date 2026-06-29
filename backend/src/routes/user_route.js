// backend/src/routes/user_routes.js
import express from "express";
import { getUserInfo, getProfile, updateProfile } from "../controllers/user_controller.js";
import { protect } from "../middlewares/protect.js"; 

const router = express.Router();

router.get("/UserInfo", protect, getUserInfo);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;