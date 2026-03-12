import User from "../models/user_model.js";

export const getUserInfo = async (req, res) => {
    try {
        // req.user is populated by your authentication middleware
        const user = await User.findById(req.user._id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getMe controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};