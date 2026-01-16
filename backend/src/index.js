import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_route.js';
import cookieParser from 'cookie-parser';
import sessionRoutes from './routes/session_route.js';

dotenv.config({ path: "../.env" });  // it is for handling .env file 

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());  

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

connectDB().then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.error("Database connection failed", err);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
