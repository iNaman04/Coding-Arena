import express from 'express';
import { signup, login, checkAuth, logout } from '../controllers/auth_controller.js';
import {
    googleAuth,
    googleCallback,
    githubAuth,
    githubCallback,
    oauthSuccess,
    oauthNotConfigured,
} from '../controllers/oauth_controller.js';
import { protect } from '../middlewares/protect.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/check-auth', protect, checkAuth);
router.post('/logout', logout);

router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return oauthNotConfigured(req, res);
    }
    return googleAuth(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return oauthNotConfigured(req, res);
    }
    return googleCallback(req, res, next);
}, oauthSuccess);

router.get('/github', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        return oauthNotConfigured(req, res);
    }
    return githubAuth(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        return oauthNotConfigured(req, res);
    }
    return githubCallback(req, res, next);
}, oauthSuccess);

export default router;
