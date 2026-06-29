import User from "../models/user_model.js";
import { generateToken } from "./token.js";

const ensureUniqueUsername = async (base) => {
    let username = base.slice(0, 20).replace(/[^a-zA-Z0-9_]/g, "");
    if (username.length < 3) username = `user${Date.now()}`;

    let candidate = username;
    let counter = 1;
    while (await User.findOne({ username: candidate })) {
        candidate = `${username}${counter}`;
        counter++;
    }
    return candidate;
};

export const findOrCreateOAuthUser = async (profile, provider) => {
    const providerId = profile.id;
    const email =
        profile.emails?.[0]?.value ||
        profile._json?.email ||
        `${providerId}@${provider}.oauth`;

    let user = await User.findOne({
        $or: [{ authProvider: provider, providerId }, { email }],
    });

    if (user) {
        if (!user.providerId) {
            user.authProvider = provider;
            user.providerId = providerId;
            await user.save();
        }
        return user;
    }

    const baseUsername =
        provider === "github"
            ? profile.username
            : (profile.displayName || email.split("@")[0])
                  .replace(/\s/g, "")
                  .toLowerCase();

    const username = await ensureUniqueUsername(baseUsername);

    user = new User({
        username,
        email,
        authProvider: provider,
        providerId,
    });
    await user.save();
    return user;
};

export const setAuthCookie = (res, userId) => {
    const token = generateToken(userId);
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: false,
    });
};
