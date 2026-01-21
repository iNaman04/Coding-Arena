import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_route.js';
import cookieParser from 'cookie-parser';
import sessionRoutes from './routes/session_route.js';
import http from 'http';
import { initSocket } from './utils/sockets.js';

dotenv.config({ path: "../.env" });  // it is for handling .env file 

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

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);


connectDB().then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.error("Database connection failed", err);
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
