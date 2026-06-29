import passport from "../config/passport.js";
import { setAuthCookie } from "../utils/oauth_user.js";
import { getIO } from "../utils/sockets.js";

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const kickExistingSession = async (user) => {
    if (!user.currentSocketId) return;
    const io = getIO();
    io.to(user.currentSocketId).emit("force_logout", {
        message: "Someone else logged into this account. You have been disconnected.",
    });
};

export const oauthSuccess = async (req, res) => {
    try {
        await kickExistingSession(req.user);
        setAuthCookie(res, req.user._id);
        res.redirect(`${frontendUrl()}/home`);
    } catch (error) {
        console.error("OAuth success handler error:", error.message);
        res.redirect(`${frontendUrl()}/login?error=oauth_failed`);
    }
};

export const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
});

export const googleCallback = passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendUrl()}/login?error=google_auth_failed`,
});

export const githubAuth = passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
});

export const githubCallback = passport.authenticate("github", {
    session: false,
    failureRedirect: `${frontendUrl()}/login?error=github_auth_failed`,
});

export const oauthNotConfigured = (_req, res) => {
    res.redirect(`${frontendUrl()}/login?error=oauth_not_configured`);
};
