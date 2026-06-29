import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth_route.js';
import cookieParser from 'cookie-parser';
import sessionRoutes from './routes/session_route.js';
import http from 'http';
import { initSocket } from './utils/sockets.js';
import battleRoutes from './routes/battle_route.js';
import leaderboardRoutes from './routes/leaderboard_route.js';
import userRoutes from './routes/user_route.js';

const app = express();
const server = http.createServer(app);

const io = initSocket(server);
app.set("io", io);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/battle', battleRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);

connectDB().then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.error("Database connection failed", err);
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
