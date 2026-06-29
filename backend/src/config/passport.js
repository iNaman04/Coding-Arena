import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { findOrCreateOAuthUser } from "../utils/oauth_user.js";

const configureGoogle = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.warn("Google OAuth not configured — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
        return;
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await findOrCreateOAuthUser(profile, "google");
                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
};

const configureGitHub = () => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        console.warn("GitHub OAuth not configured — set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET");
        return;
    }

    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CALLBACK_URL,
                scope: ["user:email"],
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await findOrCreateOAuthUser(profile, "github");
                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
};

configureGoogle();
configureGitHub();

export default passport;
